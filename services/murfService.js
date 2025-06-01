import MURF_CONFIG from '../config.js';

class MurfService {
    constructor() {
        this.apiKey = null;
        this.proxyUrl = 'https://eo1xzo7l0o69npd.m.pipedream.net'; // Pipedream webhook URL
        this.voiceOptions = {
            'voice1': {
                voiceId: 'en-US-marcus',
                style: 'rap',
                speed: 1.2,
                pitch: 1.0
            },
            'voice2': {
                voiceId: 'en-US-jordan',
                style: 'rap',
                speed: 1.1,
                pitch: 1.1
            },
            'voice3': {
                voiceId: 'en-US-michelle',
                style: 'rap',
                speed: 1.0,
                pitch: 0.9
            }
        };
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async generateAndPlaySpeech(text, voiceOption = 'voice1') {
        if (!this.apiKey) {
            throw new Error('API key not set. Please set your Murf AI API key first.');
        }

        const voiceConfig = this.voiceOptions[voiceOption];
        if (!voiceConfig) {
            throw new Error('Invalid voice option selected');
        }

        try {
            console.log('Attempting to generate speech with config:', {
                voiceId: voiceConfig.voiceId,
                style: voiceConfig.style,
                speed: voiceConfig.speed,
                pitch: voiceConfig.pitch
            });

            // Log the request payload for debugging
            const requestPayload = {
                apiKey: this.apiKey,
                text: text,
                voiceId: voiceConfig.voiceId,
                style: voiceConfig.style,
                speed: voiceConfig.speed,
                pitch: voiceConfig.pitch
            };
            console.log('Sending request to proxy with payload:', requestPayload);

            // Send request to Pipedream proxy
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            // Log the raw response for debugging
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response:', e);
                throw new Error('Invalid response format from proxy server');
            }

            if (!response.ok || data.error) {
                throw new Error(`Speech generation failed: ${data.error || 'Unknown error'}`);
            }

            if (!data.audioUrl) {
                console.error('Full response:', data);
                throw new Error('No audio URL in response. Check Pipedream logs for details.');
            }

            // Download and play the audio
            const audioResponse = await fetch(data.audioUrl);
            if (!audioResponse.ok) {
                throw new Error('Failed to download audio file');
            }

            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Play the audio
            const audio = document.getElementById('musicPlayer');
            if (!audio) {
                throw new Error('Audio player element not found');
            }

            audio.src = audioUrl;
            await audio.play();

            return audioUrl;
        } catch (error) {
            console.error('Detailed error:', error);
            throw new Error(`Speech generation failed: ${error.message}`);
        }
    }

    async getVoiceList() {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        try {
            const response = await fetch(`${this.proxyUrl}/voices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch voice list');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching voice list:', error);
            throw error;
        }
    }

    // Helper method to format text for better speech synthesis
    formatRapText(text) {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.endsWith('.') ? line : `${line}.`)
            .join('\n');
    }
}

// Create and export a singleton instance
const murfService = new MurfService();
export default murfService; 