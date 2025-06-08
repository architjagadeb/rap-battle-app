require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Debug: Check if API key is loaded
console.log('Murf API Key Loaded:', process.env.MURF_API_KEY ? '✅' : '❌');
if (!process.env.MURF_API_KEY) {
    console.log('⚠️ Warning: MURF_API_KEY not found in environment variables');
    console.log('Make sure .env file exists in', __dirname);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const MURF_API_URL = 'https://api.murf.ai/v1/speech/stream';
const PORT = process.env.PORT || 3000;
const API_KEY = 'your_murf_api_key_here';

// Valid voices configuration
const VALID_VOICES = [
    'en-US-natalie',
    'en-IN-rohan',
    'en-IN-aarav'
];

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Text to speech conversion endpoint
app.post('/api/convert', async (req, res) => {
    try {
        const { text, voiceId } = req.body;

        // Validate input
        if (!text?.trim()) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!VALID_VOICES.includes(voiceId)) {
            return res.status(400).json({ error: 'Invalid voice ID' });
        }

        // Make single request to Murf API
        const response = await axios.post(MURF_API_URL, 
            {
                text: text.trim(),
                voiceId: voiceId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': API_KEY
                },
                responseType: 'stream'
            }
        );

        // Set response headers
        res.set({
            'Content-Type': 'audio/wav',
            'Transfer-Encoding': 'chunked'
        });

        // Pipe the audio stream directly to the response
        response.data.pipe(res);

        // Handle stream completion
        response.data.on('end', () => {
            res.end();
        });

        // Handle stream errors
        response.data.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Audio streaming failed' });
            }
        });

    } catch (error) {
        console.error('Conversion error:', error.message);
        if (!res.headersSent) {
            res.status(error.response?.status || 500).json({
                error: error.message || 'Text to speech conversion failed'
            });
        }
    }
});

// Start server
app.listen(PORT, () => {
    // Validate environment
    if (!process.env.MURF_API_KEY) {
        console.error('⚠️ MURF_API_KEY not found in environment variables');
        console.error('Create a .env file in the backend directory with:');
        console.error('MURF_API_KEY=your-api-key-here');
    }

    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 
