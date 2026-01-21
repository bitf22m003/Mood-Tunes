// server.js (or app.js) - Main server file
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5173'], // Add your frontend URLs
    credentials: true
}));
app.use(express.json());

// YouTube search endpoint
app.get('/api/youtube/search', async (req, res) => {
    try {
        const { q, maxResults = 1 } = req.query;

        console.log('Received YouTube search request for:', q);

        if (!q) {
            return res.status(400).json({
                error: 'Query parameter "q" is required'
            });
        }

        // Get API key from environment variables
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.error('YouTube API Key is not configured in environment variables');
            return res.status(500).json({
                error: 'YouTube API is not configured'
            });
        }

        console.log(`Searching YouTube for: "${q}"`);

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: decodeURIComponent(q),
                key: apiKey,
                maxResults: parseInt(maxResults),
                type: 'video',
                videoCategoryId: '10', // Music category
                order: 'relevance'
            },
            timeout: 10000 // 10 second timeout
        });

        // Filter and clean the response data
        const cleanedItems = response.data.items.map(item => ({
            id: {
                videoId: item.id.videoId
            },
            snippet: {
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
                thumbnails: item.snippet.thumbnails
            }
        }));

        console.log(`Found ${cleanedItems.length} videos for query: ${q}`);

        res.json({
            items: cleanedItems,
            pageInfo: response.data.pageInfo
        });

    } catch (error) {
        console.error('YouTube API Error:', error.message);

        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);

            if (error.response.status === 403) {
                return res.status(403).json({
                    error: 'YouTube API quota exceeded or invalid API key',
                    details: error.response.data?.error?.message || 'API quota exceeded'
                });
            }

            if (error.response.status === 400) {
                return res.status(400).json({
                    error: 'Invalid request parameters',
                    details: error.response.data?.error?.message || 'Bad request'
                });
            }
        }

        res.status(500).json({
            error: 'Failed to search YouTube videos',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'YouTube API proxy server is running',
        timestamp: new Date().toISOString()
    });
});

// Catch-all handler for undefined routes
app.get('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The route ${req.path} does not exist`,
        availableRoutes: ['/api/youtube/search', '/api/health']
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`YouTube API proxy server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`YouTube search: http://localhost:${PORT}/api/youtube/search?q=test`);

    // Check if YouTube API key is configured
    if (!process.env.YOUTUBE_API_KEY) {
        console.warn('⚠️  WARNING: YOUTUBE_API_KEY not found in environment variables!');
        console.warn('   Please add YOUTUBE_API_KEY=your_key_here to your .env file');
    } else {
        console.log('✅ YouTube API key configured');
    }
});

module.exports = app;