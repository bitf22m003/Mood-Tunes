const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0/tracks";
const CLIENT_ID = "0f7a05e0"; // Your actual Jamendo client ID

// Enhanced function with better error handling and multiple format support
export async function fetchSongsByMood(mood = "happy", limit = 10) {
    // Construct the API URL with proper parameters
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        tags: mood,
        audioformat: "mp32,mp31", // Multiple audio formats for better availability
        include: "musicinfo,licenses", // Include additional metadata
        order: "popularity_total", // Order by popularity for better quality
        featured: "1" // Get featured tracks for higher quality
    });

    const url = `${JAMENDO_API_BASE}/?${params.toString()}`;

    console.log(`Fetching Jamendo tracks for mood "${mood}" with limit ${limit}`);
    console.log(`API URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MoodTunes/1.0'
            }
        });

        console.log(`Jamendo API response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Jamendo API response:`, data);

        // Check if we have results
        if (!data.results || !Array.isArray(data.results)) {
            console.warn('No results found in Jamendo API response');
            return [];
        }

        if (data.results.length === 0) {
            console.warn(`No tracks found for mood: ${mood}`);
            return [];
        }

        // Transform the data to match our app's format
        const transformedSongs = data.results
            .filter(song => {
                // Filter out songs without essential data
                return song &&
                    song.id &&
                    song.name &&
                    song.artist_name &&
                    song.audio &&
                    song.duration > 0;
            })
            .map(song => {
                // Format duration properly
                const minutes = Math.floor(song.duration / 60);
                const seconds = song.duration % 60;
                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                // Get the best available image
                let imageUrl = "https://via.placeholder.com/300x300/6366f1/ffffff?text=♪";
                if (song.album_image) {
                    imageUrl = song.album_image;
                } else if (song.image) {
                    imageUrl = song.image;
                }

                return {
                    id: song.id.toString(),
                    title: song.name || "Unknown Title",
                    artist: song.artist_name || "Unknown Artist",
                    album: song.album_name || "Unknown Album",
                    duration: formattedDuration,
                    preview_url: song.audio || null,
                    external_url: `https://www.jamendo.com/track/${song.id}`,
                    image: imageUrl,
                    // Additional metadata for better matching
                    genre: song.musicinfo?.tags?.genres?.join(", ") || mood,
                    mood: mood,
                    jamendo_id: song.id,
                    license: song.license_ccurl || "Creative Commons",
                    artist_id: song.artist_id,
                    album_id: song.album_id,
                    // Fake some metrics for consistency with Spotify format
                    popularity: Math.floor(Math.random() * 100) + 1,
                    energy: calculateEnergyFromMood(mood)
                };
            });

        console.log(`Successfully transformed ${transformedSongs.length} songs for mood: ${mood}`);
        return transformedSongs;

    } catch (error) {
        console.error(`Failed to fetch songs from Jamendo for mood "${mood}":`, error);

        // Return empty array on error, but log the specific error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('Network error - check your internet connection');
        } else if (error.message.includes('API error')) {
            console.error('Jamendo API is currently unavailable');
        }

        return [];
    }
}

// Alternative function to search by multiple tags
export async function fetchSongsByTags(tags = ["happy"], limit = 10) {
    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    const tagString = tags.join(",");
    return await fetchSongsByMood(tagString, limit);
}

// Function to fetch songs by genre instead of mood
export async function fetchSongsByGenre(genre = "pop", limit = 10) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        genre: genre, // Use genre parameter instead of tags
        audioformat: "mp32,mp31",
        include: "musicinfo,licenses",
        order: "popularity_total",
        featured: "1"
    });

    const url = `${JAMENDO_API_BASE}/?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.results) {
            throw new Error("Jamendo API error");
        }

        return data.results
            .filter(song => song && song.id && song.name && song.artist_name && song.audio)
            .map(song => ({
                id: song.id.toString(),
                title: song.name,
                artist: song.artist_name,
                album: song.album_name || "Unknown Album",
                duration: `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`,
                preview_url: song.audio,
                external_url: `https://www.jamendo.com/track/${song.id}`,
                image: song.album_image || "https://via.placeholder.com/300x300/6366f1/ffffff?text=♪",
                genre: genre,
                popularity: Math.floor(Math.random() * 100) + 1,
                energy: calculateEnergyFromGenre(genre)
            }));

    } catch (error) {
        console.error(`Failed to fetch songs by genre "${genre}":`, error);
        return [];
    }
}

// Helper function to calculate energy level based on mood
function calculateEnergyFromMood(mood) {
    const energyMap = {
        "happy": 8,
        "energetic": 9,
        "party": 10,
        "upbeat": 9,
        "sad": 3,
        "melancholy": 2,
        "calm": 2,
        "chill": 3,
        "relaxing": 2,
        "romantic": 4,
        "focus": 3,
        "ambient": 2,
        "peaceful": 2
    };

    return energyMap[mood.toLowerCase()] || 5;
}

// Helper function to calculate energy level based on genre
function calculateEnergyFromGenre(genre) {
    const energyMap = {
        "rock": 9,
        "metal": 10,
        "electronic": 8,
        "dance": 9,
        "pop": 7,
        "jazz": 5,
        "classical": 3,
        "ambient": 2,
        "folk": 4,
        "country": 6,
        "reggae": 5,
        "blues": 4,
        "funk": 8,
        "soul": 6,
        "hip-hop": 7,
        "rap": 8,
        "indie": 6,
        "alternative": 7,
        "punk": 9,
        "ska": 8,
        "reggaeton": 9,
        "latin": 7,
        "world": 5,
        "instrumental": 3,
        "acoustic": 4,
        "lounge": 3,
        "downtempo": 3,
        "trance": 8,
        "house": 8,
        "techno": 9,
        "dubstep": 10,
        "drum-and-bass": 9,
        "chillout": 2
    };

    return energyMap[genre.toLowerCase()] || 5;
}

// Advanced search function that combines multiple parameters
export async function fetchSongsAdvanced({
    mood = null,
    genre = null,
    tags = null,
    limit = 10,
    order = "popularity_total",
    featured = true
} = {}) {

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: "mp32,mp31",
        include: "musicinfo,licenses",
        order: order
    });

    // Add search parameters based on what's provided
    if (mood && !genre && !tags) {
        params.append("tags", mood);
    } else if (genre && !mood && !tags) {
        params.append("genre", genre);
    } else if (tags) {
        const tagString = Array.isArray(tags) ? tags.join(",") : tags;
        params.append("tags", tagString);
    } else if (mood && genre) {
        // Combine mood and genre
        params.append("tags", mood);
        params.append("genre", genre);
    }

    if (featured) {
        params.append("featured", "1");
    }

    const url = `${JAMENDO_API_BASE}/?${params.toString()}`;

    console.log(`Advanced Jamendo search:`, { mood, genre, tags, limit });
    console.log(`API URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MoodTunes/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            console.warn('No results found for advanced search');
            return [];
        }

        return data.results
            .filter(song => song && song.id && song.name && song.artist_name && song.audio && song.duration > 0)
            .map(song => {
                const minutes = Math.floor(song.duration / 60);
                const seconds = song.duration % 60;
                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                let imageUrl = "https://via.placeholder.com/300x300/6366f1/ffffff?text=♪";
                if (song.album_image) {
                    imageUrl = song.album_image;
                } else if (song.image) {
                    imageUrl = song.image;
                }

                return {
                    id: song.id.toString(),
                    title: song.name || "Unknown Title",
                    artist: song.artist_name || "Unknown Artist",
                    album: song.album_name || "Unknown Album",
                    duration: formattedDuration,
                    preview_url: song.audio,
                    external_url: `https://www.jamendo.com/track/${song.id}`,
                    image: imageUrl,
                    genre: song.musicinfo?.tags?.genres?.join(", ") || genre || mood,
                    mood: mood || "unknown",
                    jamendo_id: song.id,
                    license: song.license_ccurl || "Creative Commons",
                    artist_id: song.artist_id,
                    album_id: song.album_id,
                    popularity: Math.floor(Math.random() * 100) + 1,
                    energy: genre ? calculateEnergyFromGenre(genre) : calculateEnergyFromMood(mood || "happy"),
                    // Additional metadata
                    release_date: song.releasedate || null,
                    duration_ms: song.duration * 1000, // Convert to milliseconds for consistency
                    explicit: false, // Jamendo doesn't typically have explicit content
                    preview_available: !!song.audio
                };
            });

    } catch (error) {
        console.error('Advanced Jamendo search failed:', error);
        return [];
    }
}

// Function to get popular tracks without specific mood/genre filtering
export async function fetchPopularTracks(limit = 20) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: "mp32,mp31",
        include: "musicinfo,licenses",
        order: "popularity_total",
        featured: "1"
    });

    const url = `${JAMENDO_API_BASE}/?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.results) {
            throw new Error("Failed to fetch popular tracks");
        }

        return data.results
            .filter(song => song && song.id && song.name && song.artist_name && song.audio)
            .map(song => ({
                id: song.id.toString(),
                title: song.name,
                artist: song.artist_name,
                album: song.album_name || "Unknown Album",
                duration: `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`,
                preview_url: song.audio,
                external_url: `https://www.jamendo.com/track/${song.id}`,
                image: song.album_image || "https://via.placeholder.com/300x300/6366f1/ffffff?text=♪",
                genre: song.musicinfo?.tags?.genres?.join(", ") || "Various",
                popularity: Math.floor(Math.random() * 100) + 1,
                energy: 5 // Default energy for popular tracks
            }));

    } catch (error) {
        console.error('Failed to fetch popular tracks:', error);
        return [];
    }
}

// Function to validate Jamendo API connection
export async function validateJamendoConnection() {
    try {
        const testResponse = await fetch(`${JAMENDO_API_BASE}/?client_id=${CLIENT_ID}&format=json&limit=1`);

        if (testResponse.ok) {
            const data = await testResponse.json();
            console.log('Jamendo API connection successful:', data);
            return true;
        } else {
            console.error('Jamendo API connection failed:', testResponse.status);
            return false;
        }
    } catch (error) {
        console.error('Jamendo API connection error:', error);
        return false;
    }
}

// Export all functions
// export {
//     fetchSongsByMood as default,
//     fetchSongsByTags,
//     fetchSongsByGenre,
//     fetchSongsAdvanced,
//     fetchPopularTracks,
//     validateJamendoConnection,
//     calculateEnergyFromMood,
//     calculateEnergyFromGenre
// };