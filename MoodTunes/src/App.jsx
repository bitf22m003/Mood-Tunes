import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoodSelector from "./components/MoodSelector";
import { moods } from "./data/moods";
import IntensitySlider from "./components/IntensitySlider";
import { activities } from "./data/activities";
import ActivitySelector from "./components/ActivitySelector";
import { Music } from "lucide-react";
import Playlist from "./components/Playlist";
import { fetchSongsByMood } from './api/jamendo';

const SPOTIFY_CLIENT_ID = 'bbc788e6e3d948d3b39030d65a11a3a4';
const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5731";
const SPOTIFY_SCOPES = "user-read-private user-read-email";

// Enhanced mood-to-tag mapping for Jamendo API
const moodToJamendoTags = {
  happy: ["happy", "upbeat", "energetic", "positive", "cheerful", "joyful"],
  sad: ["sad", "melancholy", "emotional", "blues", "melancholic", "sorrowful"],
  energetic: ["energetic", "upbeat", "powerful", "intense", "dynamic", "driving"],
  calm: ["calm", "chill", "relaxing", "peaceful", "ambient", "tranquil"],
  romantic: ["romantic", "love", "tender", "intimate", "soft", "emotional"],
  focus: ["instrumental", "ambient", "classical", "concentration", "meditation", "minimal"],
  party: ["party", "dance", "electronic", "upbeat", "energetic", "celebration"],
  chill: ["chill", "lounge", "downtempo", "relaxed", "mellow", "easy"]
};

// Activity-based tag mapping for Jamendo
const activityToJamendoTags = {
  working: ["instrumental", "ambient", "concentration", "minimal", "peaceful"],
  exercising: ["energetic", "upbeat", "powerful", "driving", "intense"],
  relaxing: ["chill", "relaxing", "peaceful", "ambient", "soft"],
  studying: ["instrumental", "classical", "ambient", "minimal", "concentration"],
  partying: ["party", "dance", "electronic", "upbeat", "energetic"],
  driving: ["upbeat", "energetic", "powerful", "driving", "rock"],
  cooking: ["upbeat", "happy", "energetic", "positive", "cheerful"],
  socializing: ["upbeat", "happy", "energetic", "party", "positive"]
};

// Helper functions for PKCE
function generateCodeVerifier() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(128));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());
  console.log('Parsed URL params:', params);
  return params;
}

function App() {
  // UI state
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [activity, setActivity] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);

  // Auth state
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  console.log("Client ID:", SPOTIFY_CLIENT_ID);

  // Handle Spotify OAuth login with PKCE
  const loginToSpotify = useCallback(async () => {
    try {
      // Clear any existing data
      localStorage.removeItem('code_verifier');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expiry');
      sessionStorage.removeItem('processed_auth_code');

      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);

      console.log('Generated verifier length:', verifier.length);
      console.log('Generated challenge length:', challenge.length);

      // Store the verifier for later use
      localStorage.setItem('code_verifier', verifier);

      const params = new URLSearchParams();
      params.append("client_id", SPOTIFY_CLIENT_ID);
      params.append("response_type", "code");
      params.append("redirect_uri", SPOTIFY_REDIRECT_URI);
      params.append("scope", SPOTIFY_SCOPES);
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);
      params.append("state", Date.now().toString());
      params.append("show_dialog", "true");
      params.append("prompt", "login");

      const authUrl = `https://accounts.spotify.com/authorize?${params}`;
      console.log('Redirecting to:', authUrl);

      window.location.assign(authUrl);
    } catch (error) {
      console.error('Error during login setup:', error);
      alert('Error setting up authentication. Please try again.');
    }
  }, []);

  // Exchange authorization code for access token
  const exchangeCodeForToken = useCallback(async (code) => {
    const verifier = localStorage.getItem('code_verifier');

    if (!verifier) {
      console.error('No code verifier found');
      sessionStorage.removeItem('processed_auth_code');
      alert('Authentication error: No code verifier found. Please try logging in again.');
      return;
    }

    console.log('Exchanging code for token...');

    const body = new URLSearchParams();
    body.append("client_id", SPOTIFY_CLIENT_ID);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", SPOTIFY_REDIRECT_URI);
    body.append("code_verifier", verifier);

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      const data = await response.json();
      console.log('Token response status:', response.status);
      console.log('Token response data:', data);

      if (response.ok && data.access_token) {
        setAccessToken(data.access_token);
        const expiry = Date.now() + data.expires_in * 1000;
        setTokenExpiry(expiry);

        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_token_expiry", expiry.toString());

        localStorage.removeItem('code_verifier');
        sessionStorage.removeItem('processed_auth_code');

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        console.log('Successfully authenticated!');
      } else {
        console.error('Token exchange failed:', response.status, data);

        let errorMessage = 'Authentication failed';
        if (data.error === 'invalid_grant') {
          errorMessage = 'Authentication code expired. Please try logging in again.';
        } else if (data.error === 'invalid_client') {
          errorMessage = 'Invalid client configuration. Please check your app settings.';
        } else if (data.error_description) {
          errorMessage = data.error_description;
        }

        localStorage.removeItem('code_verifier');
        sessionStorage.removeItem('processed_auth_code');
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error during token exchange:', error);

      localStorage.removeItem('code_verifier');
      sessionStorage.removeItem('processed_auth_code');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      alert('Network error during authentication. Please check your internet connection and try again.');
    }
  }, []);

  const logout = () => {
    setAccessToken(null);
    setTokenExpiry(null);
    setPlaylist([]);
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem('code_verifier');
    sessionStorage.removeItem('processed_auth_code');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // On mount, check for OAuth response or stored token
  useEffect(() => {
    const urlParams = getUrlParams();
    console.log('URL Params on mount:', urlParams);

    if (urlParams.code && !accessToken) {
      console.log('Found authorization code, attempting token exchange...');

      const processedCode = sessionStorage.getItem('processed_auth_code');
      if (processedCode === urlParams.code) {
        console.log('Code already processed, cleaning URL');
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return;
      }

      sessionStorage.setItem('processed_auth_code', urlParams.code);
      exchangeCodeForToken(urlParams.code);

    } else if (urlParams.error) {
      console.error('OAuth error:', urlParams.error, urlParams.error_description);
      alert(`Authentication error: ${urlParams.error_description || urlParams.error}`);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (!urlParams.code) {
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedExpiry = localStorage.getItem("spotify_token_expiry");

      if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
        console.log('Using stored token');
        setAccessToken(storedToken);
        setTokenExpiry(Number(storedExpiry));
      }
    }
  }, [exchangeCodeForToken, accessToken]);

  // Enhanced Jamendo track fetching with mood, intensity, and activity
  const fetchJamendoTracks = async (mood, intensityLevel, activityType) => {
    console.log('Fetching Jamendo tracks for mood:', mood, 'intensity:', intensityLevel, 'activity:', activityType);

    try {
      setIsGenerating(true);

      // Get base mood tags
      const baseTags = moodToJamendoTags[mood] || [mood];

      // Add activity-based tags if activity is selected
      let allTags = [...baseTags];
      if (activityType && activityToJamendoTags[activityType]) {
        allTags = [...allTags, ...activityToJamendoTags[activityType]];
      }

      // Remove duplicates and limit tags
      const uniqueTags = [...new Set(allTags)].slice(0, 5);

      // Adjust limit based on intensity (higher intensity = more varied results)
      const baseLimit = 15;
      const intensityMultiplier = intensityLevel > 7 ? 1.5 : intensityLevel < 4 ? 0.8 : 1;
      const limit = Math.round(baseLimit * intensityMultiplier);

      console.log('Using tags:', uniqueTags, 'with limit:', limit);

      // Fetch songs for each tag and combine results
      const allSongs = [];

      for (const tag of uniqueTags.slice(0, 3)) { // Use top 3 tags to avoid too many requests
        try {
          const songs = await fetchSongsByMood(tag, Math.ceil(limit / 3));
          if (songs && songs.length > 0) {
            // Add metadata for sorting
            const enhancedSongs = songs.map(song => ({
              ...song,
              moodTag: tag,
              intensityMatch: calculateIntensityMatch(song, intensityLevel),
              activityMatch: activityType ? calculateActivityMatch(song, activityType) : 50
            }));
            allSongs.push(...enhancedSongs);
          }
        } catch (error) {
          console.error(`Error fetching songs for tag ${tag}:`, error);
        }
      }

      // Remove duplicates based on song ID
      const uniqueSongs = allSongs.filter((song, index, arr) =>
        arr.findIndex(s => s.id === song.id) === index
      );

      // Sort by relevance (activity match, then intensity match, then random)
      const sortedSongs = uniqueSongs.sort((a, b) => {
        // First priority: activity match
        if (activityType) {
          const activityDiff = b.activityMatch - a.activityMatch;
          if (Math.abs(activityDiff) > 10) return activityDiff;
        }

        // Second priority: intensity match
        const intensityDiff = b.intensityMatch - a.intensityMatch;
        if (Math.abs(intensityDiff) > 5) return intensityDiff;

        // Third priority: randomize for variety
        return Math.random() - 0.5;
      });

      // Take top results
      const finalPlaylist = sortedSongs.slice(0, Math.min(20, sortedSongs.length));

      console.log(`Generated playlist with ${finalPlaylist.length} songs`);
      return finalPlaylist;

    } catch (error) {
      console.error('Error generating Jamendo playlist:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to calculate intensity match (simulate based on song properties)
  const calculateIntensityMatch = (song, targetIntensity) => {
    // Simulate intensity based on song title and artist keywords
    const text = `${song.title} ${song.artist}`.toLowerCase();

    const highEnergyKeywords = ['rock', 'metal', 'electronic', 'dance', 'punk', 'fast', 'energy', 'power'];
    const lowEnergyKeywords = ['ambient', 'chill', 'soft', 'calm', 'peaceful', 'slow', 'meditation', 'acoustic'];

    let estimatedIntensity = 5; // Default middle intensity

    // Adjust based on keywords
    const highEnergyCount = highEnergyKeywords.filter(keyword => text.includes(keyword)).length;
    const lowEnergyCount = lowEnergyKeywords.filter(keyword => text.includes(keyword)).length;

    if (highEnergyCount > lowEnergyCount) {
      estimatedIntensity += highEnergyCount * 1.5;
    } else if (lowEnergyCount > highEnergyCount) {
      estimatedIntensity -= lowEnergyCount * 1.5;
    }

    estimatedIntensity = Math.max(1, Math.min(10, estimatedIntensity));

    // Calculate match score (100 = perfect match, 0 = worst match)
    const difference = Math.abs(estimatedIntensity - targetIntensity);
    return Math.max(0, 100 - (difference * 15));
  };

  // Helper function to calculate activity match
  const calculateActivityMatch = (song, targetActivity) => {
    if (!activityToJamendoTags[targetActivity]) return 50;

    const text = `${song.title} ${song.artist}`.toLowerCase();
    const activityKeywords = activityToJamendoTags[targetActivity];

    const matchCount = activityKeywords.filter(keyword =>
      text.includes(keyword.toLowerCase())
    ).length;

    return Math.min(100, 50 + (matchCount * 20)); // Base 50, +20 per keyword match
  };

  // Generate playlist when mood, intensity, or activity changes
  useEffect(() => {
    if (selectedMood && accessToken) {
      console.log('Generating new playlist...');
      fetchJamendoTracks(selectedMood, intensity, activity)
        .then((tracks) => {
          setPlaylist(tracks);
          if (tracks.length === 0) {
            console.log('No tracks found - this might be due to API limitations');
          }
        })
        .catch((error) => {
          console.error('Error generating playlist:', error);
          setPlaylist([]);
        });
    }
  }, [selectedMood, intensity, activity, accessToken]);

  // Mood color helper
  const getMoodColor = (moodName) => {
    const mood = moods.find((m) => m.name === moodName);
    return mood ? mood.color : "from-gray-400 to-gray-600";
  };

  // Enhanced mood match percentage calculation
  const getMoodMatchPercentage = (song) => {
    let score = 75; // Base score

    // Add intensity match bonus
    if (song.intensityMatch) {
      score = (score * 0.6) + (song.intensityMatch * 0.4);
    }

    // Add activity match bonus
    if (song.activityMatch && activity) {
      score = (score * 0.7) + (song.activityMatch * 0.3);
    }

    // Add some randomness for variety
    score += (Math.random() - 0.5) * 10;

    return Math.min(Math.max(Math.round(score), 65), 98); // Keep between 65-98
  };

  // The app UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Header />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-12">
          {!accessToken ? (
            <div className="text-center py-10">
              <button
                onClick={loginToSpotify}
                className="bg-green-500 hover:bg-green-600 text-lg px-8 py-3 rounded-full font-semibold mt-8 shadow-md transition-colors"
              >
                Log in with Spotify
              </button>
              <p className="text-gray-300 mt-4">
                Log in with Spotify to unlock personalized music recommendations from Jamendo.
              </p>
              <div className="mt-6 text-sm text-blue-300 bg-blue-900/20 p-4 rounded-lg max-w-md mx-auto">
                <strong>✨ New:</strong> We use Jamendo's extensive music library for high-quality previews and downloads!
              </div>
            </div>
          ) : (
            <>
              <div className="text-right mb-2">
                <button
                  className="text-xl text-pink-300 hover:text-red-400 underline transition-colors"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
              <h2 className="text-3xl font-bold mt-8 mb-9 text-center">How are you feeling?</h2>
              <MoodSelector
                moods={moods}
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
              />

              {selectedMood && (
                <>
                  <IntensitySlider
                    selectedMood={selectedMood}
                    intensity={intensity}
                    setIntensity={setIntensity}
                    getMoodColor={getMoodColor}
                  />
                  <ActivitySelector
                    activities={activities}
                    activity={activity}
                    setActivity={setActivity}
                    selectedMood={selectedMood}
                    getMoodColor={getMoodColor}
                  />
                </>
              )}
            </>
          )}
        </section>

        {selectedMood && accessToken && (
          <>
            {/* Playlist customization status */}
            {(activity || intensity !== 5) && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 bg-black bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 text-sm">
                  <span className="text-gray-300">Customized for:</span>
                  {intensity !== 5 && (
                    <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getMoodColor(selectedMood)} text-white`}>
                      Intensity {intensity}/10
                    </span>
                  )}
                  {activity && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-600 text-white capitalize">
                      {activity}
                    </span>
                  )}
                </div>
              </div>
            )}

            <Playlist
              playlist={playlist}
              isGenerating={isGenerating}
              getMoodColor={getMoodColor}
              selectedMood={selectedMood}
              getMoodMatchPercentage={getMoodMatchPercentage}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
              currentSongId={currentSongId}
              setCurrentSongId={setCurrentSongId}
            />
          </>
        )}

        {(!selectedMood || !accessToken) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome to MoodTunes</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover amazing music from Jamendo's library, personalized to your mood and activity.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;