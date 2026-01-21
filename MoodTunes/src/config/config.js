// Application Configuration
// Centralized configuration for the MoodTunes app

// API Configuration
export const API_CONFIG = {
    // Spotify Configuration
    spotify: {
        clientId: 'bbc788e6e3d948d3b39030d65a11a3a4',
        redirectUri: process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5731'
            : 'https://yourdomain.com', // Update this for production
        scopes: 'user-read-private user-read-email',
        apiBaseUrl: 'https://api.spotify.com/v1',
        authBaseUrl: 'https://accounts.spotify.com'
    },

    // Jamendo Configuration
    jamendo: {
        clientId: '0f7a05e0',
        apiBaseUrl: 'https://api.jamendo.com/v3.0',
        defaultLimit: 10,
        maxLimit: 50,
        audioFormats: ['mp32', 'mp31'], // Preferred audio formats
        defaultOrder: 'popularity_total',
        includeFeatured: true
    }
};

// App Settings
export const APP_CONFIG = {
    // UI Settings
    ui: {
        defaultIntensity: 5,
        maxPlaylistSize: 25,
        animationDuration: 300,
        debounceDelay: 500, // For search inputs
        autoPlayDelay: 1000 // Delay before auto-playing next song
    },

    // Audio Settings
    audio: {
        defaultVolume: 0.7,
        fadeInDuration: 1000,
        fadeOutDuration: 500,
        previewDuration: 30000, // 30 seconds
        crossfadeDuration: 2000
    },

    // Cache Settings
    cache: {
        tokenExpiry: 3600000, // 1 hour in milliseconds
        playlistExpiry: 300000, // 5 minutes in milliseconds
        maxCacheSize: 100, // Maximum number of cached playlists
        enableCache: true
    },

    // Feature Flags
    features: {
        enableSpotifyAuth: true,
        enableJamendoAPI: true,
        enableAudioPreview: true,
        enablePlaylistSharing: false, // Future feature
        enableOfflineMode: false, // Future feature
        enableUserPlaylists: false, // Future feature
        debugMode: process.env.NODE_ENV === 'development'
    }
};

// Mood and Activity Mappings
export const CONTENT_MAPPINGS = {
    // Enhanced mood-to-tag mapping for Jamendo API
    moodToTags: {
        happy: ["happy", "upbeat", "energetic", "positive", "cheerful", "joyful", "bright", "sunny"],
        sad: ["sad", "melancholy", "emotional", "blues", "melancholic", "sorrowful", "nostalgic", "heartbreak"],
        energetic: ["energetic", "upbeat", "powerful", "intense", "dynamic", "driving", "electric", "pumping"],
        calm: ["calm", "chill", "relaxing", "peaceful", "ambient", "tranquil", "serene", "meditative"],
        romantic: ["romantic", "love", "tender", "intimate", "soft", "emotional", "passionate", "sweet"],
        focus: ["instrumental", "ambient", "classical", "concentration", "meditation", "minimal", "study", "focus"],
        party: ["party", "dance", "electronic", "upbeat", "energetic", "celebration", "club", "festive"],
        chill: ["chill", "lounge", "downtempo", "relaxed", "mellow", "easy", "laid-back", "smooth"]
    },

    // Activity-based tag mapping for better song matching
    activityToTags: {
        working: ["instrumental", "ambient", "concentration", "minimal", "peaceful", "productivity", "focus", "background"],
        exercising: ["energetic", "upbeat", "powerful", "driving", "intense", "workout", "fitness", "motivation"],
        relaxing: ["chill", "relaxing", "peaceful", "ambient", "soft", "calm", "tranquil", "zen"],
        studying: ["instrumental", "classical", "ambient", "minimal", "concentration", "study", "focus", "quiet"],
        partying: ["party", "dance", "electronic", "upbeat", "energetic", "club", "celebration", "fun"],
        driving: ["upbeat", "energetic", "powerful", "driving", "rock", "road", "travel", "highway"],
        cooking: ["upbeat", "happy", "energetic", "positive", "cheerful", "kitchen", "fun", "lively"],
        socializing: ["upbeat", "happy", "energetic", "party", "positive", "social", "friends", "gathering"]
    },

    // Genre energy mapping for better intensity matching
    genreEnergyMap: {
        "rock": 9, "metal": 10, "electronic": 8, "dance": 9, "pop": 7,
        "jazz": 5, "classical": 3, "ambient": 2, "folk": 4, "country": 6,
        "reggae": 5, "blues": 4, "funk": 8, "soul": 6, "hip-hop": 7,
        "rap": 8, "indie": 6, "alternative": 7, "punk": 9, "ska": 8,
        "reggaeton": 9, "latin": 7, "world": 5, "instrumental": 3,
        "acoustic": 4, "lounge": 3, "downtempo": 3, "trance": 8,
        "house": 8, "techno": 9, "dubstep": 10, "drum-and-bass": 9,
        "chillout": 2, "new-age": 2, "soundtrack": 4, "experimental": 5
    }
};

// Error Messages
export const ERROR_MESSAGES = {
    network: "Network error. Please check your internet connection and try again.",
    auth: "Authentication failed. Please try logging in again.",
    api: "Music service is temporarily unavailable. Please try again later.",
    noSongs: "No songs found for your selection. Try adjusting your mood or activity.",
    audioFailed: "Unable to play audio preview. This might be due to browser restrictions.",
    tokenExpired: "Your session has expired. Please log in again.",
    rateLimited: "Too many requests. Please wait a moment and try again.",
    generic: "Something went wrong. Please try again."
};

// Success Messages
export const SUCCESS_MESSAGES = {
    authSuccess: "Successfully logged in! Your personalized music experience is ready.",
    playlistGenerated: "Your playlist has been generated based on your mood and preferences!",
    songLoaded: "Song loaded successfully. Click play to listen.",
    settingsSaved: "Your preferences have been saved.",
    playlistShared: "Playlist shared successfully!"
};

// Default Playlists for fallback when API fails
export const FALLBACK_PLAYLISTS = {
    happy: [
        { id: "fallback_1", title: "Sunny Day", artist: "Happy Vibes", duration: "3:24", mood: "happy" },
        { id: "fallback_2", title: "Good Times", artist: "Positive Energy", duration: "2:58", mood: "happy" },
        { id: "fallback_3", title: "Celebration", artist: "Joy Makers", duration: "3:45", mood: "happy" }
    ],
    sad: [
        { id: "fallback_4", title: "Rainy Days", artist: "Melancholy Soul", duration: "4:12", mood: "sad" },
        { id: "fallback_5", title: "Blue Memories", artist: "Emotional Depth", duration: "3:33", mood: "sad" },
        { id: "fallback_6", title: "Heartache", artist: "Deep Feelings", duration: "4:01", mood: "sad" }
    ],
    energetic: [
        { id: "fallback_7", title: "Power Up", artist: "Energy Boost", duration: "3:15", mood: "energetic" },
        { id: "fallback_8", title: "Electric Feel", artist: "High Voltage", duration: "2:47", mood: "energetic" },
        { id: "fallback_9", title: "Adrenaline Rush", artist: "Intense Beats", duration: "3:28", mood: "energetic" }
    ],
    calm: [
        { id: "fallback_10", title: "Peaceful Mind", artist: "Tranquil Sounds", duration: "4:22", mood: "calm" },
        { id: "fallback_11", title: "Meditation", artist: "Calm Waves", duration: "5:15", mood: "calm" },
        { id: "fallback_12", title: "Serenity", artist: "Quiet Moments", duration: "3:54", mood: "calm" }
    ]
};

// Utility Functions
export const UTILS = {
    // Format duration from seconds to mm:ss
    formatDuration: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    },

    // Parse duration from mm:ss to seconds
    parseDuration: (duration) => {
        if (!duration || typeof duration !== 'string') return 0;
        const [minutes, seconds] = duration.split(':').map(Number);
        return (minutes * 60) + (seconds || 0);
    },

    // Generate a random ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce function for search inputs
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Shuffle array
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Calculate mood match percentage
    calculateMoodMatch: (song, targetMood, intensity = 5, activity = null) => {
        let score = 75; // Base score

        // Mood matching
        if (song.mood === targetMood) {
            score += 15;
        } else if (song.genre && song.genre.toLowerCase().includes(targetMood)) {
            score += 10;
        }

        // Intensity matching
        if (song.energy && intensity) {
            const energyDiff = Math.abs(song.energy - intensity);
            const energyScore = Math.max(0, 100 - (energyDiff * 10));
            score = (score * 0.7) + (energyScore * 0.3);
        }

        // Activity matching
        if (activity && song.activity === activity) {
            score += 10;
        }

        // Add some randomness for variety
        score += (Math.random() - 0.5) * 8;

        return Math.min(Math.max(Math.round(score), 60), 98);
    },

    // Validate song object
    validateSong: (song) => {
        return song &&
            typeof song.id === 'string' &&
            typeof song.title === 'string' &&
            typeof song.artist === 'string' &&
            song.title.length > 0 &&
            song.artist.length > 0;
    },

    // Get fallback image URL
    getFallbackImage: (mood = 'default') => {
        const imageMap = {
            happy: 'https://via.placeholder.com/300x300/FFD700/000000?text=😊',
            sad: 'https://via.placeholder.com/300x300/4682B4/FFFFFF?text=😢',
            energetic: 'https://via.placeholder.com/300x300/FF4500/FFFFFF?text=⚡',
            calm: 'https://via.placeholder.com/300x300/98FB98/000000?text=🧘',
            romantic: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=💕',
            focus: 'https://via.placeholder.com/300x300/9370DB/FFFFFF?text=🎯',
            party: 'https://via.placeholder.com/300x300/FF1493/FFFFFF?text=🎉',
            chill: 'https://via.placeholder.com/300x300/20B2AA/FFFFFF?text=😎',
            default: 'https://via.placeholder.com/300x300/6366F1/FFFFFF?text=♪'
        };
        return imageMap[mood] || imageMap.default;
    }
};

// Local Storage Keys
export const STORAGE_KEYS = {
    spotifyToken: 'spotify_access_token',
    spotifyExpiry: 'spotify_token_expiry',
    codeVerifier: 'code_verifier',
    processedAuthCode: 'processed_auth_code',
    userPreferences: 'user_preferences',
    cachedPlaylists: 'cached_playlists',
    lastMood: 'last_selected_mood',
    lastIntensity: 'last_intensity_level',
    lastActivity: 'last_selected_activity',
    audioVolume: 'audio_volume_level'
};

// Development Configuration
export const DEV_CONFIG = {
    enableLogging: process.env.NODE_ENV === 'development',
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
    mockAPIResponses: false, // Set to true to use mock data during development
    showDebugInfo: process.env.NODE_ENV === 'development',
    logLevel: 'debug' // 'debug', 'info', 'warn', 'error'
};

// Performance thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
    apiResponseTime: 5000, // 5 seconds
    playlistGenerationTime: 10000, // 10 seconds
    audioLoadTime: 3000, // 3 seconds
    uiResponseTime: 100 // 100ms
};

// Browser compatibility checks
export const BROWSER_SUPPORT = {
    requiredFeatures: [
        'fetch',
        'Promise',
        'URLSearchParams',
        'localStorage',
        'Audio'
    ],

    checkSupport: () => {
        const unsupported = [];

        if (!window.fetch) unsupported.push('fetch');
        if (!window.Promise) unsupported.push('Promise');
        if (!window.URLSearchParams) unsupported.push('URLSearchParams');
        if (!window.localStorage) unsupported.push('localStorage');
        if (!window.Audio) unsupported.push('Audio');
        if (!window.crypto || !window.crypto.subtle) unsupported.push('Web Crypto API');

        return {
            supported: unsupported.length === 0,
            unsupportedFeatures: unsupported
        };
    }
};

// Export configuration validator
export const validateConfig = () => {
    const errors = [];

    // Check required Spotify config
    if (!API_CONFIG.spotify.clientId) {
        errors.push('Spotify client ID is required');
    }

    // Check required Jamendo config
    if (!API_CONFIG.jamendo.clientId) {
        errors.push('Jamendo client ID is required');
    }

    // Check browser support
    const browserSupport = BROWSER_SUPPORT.checkSupport();
    if (!browserSupport.supported) {
        errors.push(`Browser missing required features: ${browserSupport.unsupportedFeatures.join(', ')}`);
    }

    // Check localStorage availability
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        errors.push('localStorage is not available');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

// Initialize configuration
export const initializeConfig = () => {
    const validation = validateConfig();

    if (!validation.valid) {
        console.error('Configuration validation failed:', validation.errors);

        if (DEV_CONFIG.enableLogging) {
            validation.errors.forEach(error => console.error('Config Error:', error));
        }
    }

    if (DEV_CONFIG.enableLogging) {
        console.log('MoodTunes Configuration Initialized:', {
            spotify: { ...API_CONFIG.spotify, clientId: '***' },
            jamendo: { ...API_CONFIG.jamendo, clientId: '***' },
            features: APP_CONFIG.features,
            browserSupport: BROWSER_SUPPORT.checkSupport()
        });
    }

    return validation.valid;
};

// Export all configurations
// export default {
//   API_CONFIG,
//   APP_CONFIG,
//   CONTENT_MAPPINGS,
//   ERROR_MESSAGES,
//   SUCCESS_MESSAGES,
//   FALLBACK_PLAYLISTS,
//   UTILS,
//   STORAGE_KEYS,
//   DEV_CONFIG,
//   PERFORMANCE_THRESHOLDS,
//   BROWSER_SUPPORT,
//   validateConfig,
//   initializeConfig
// };