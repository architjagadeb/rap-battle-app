class MurfService {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.voices = [
            { id: 'en-US-natalie', name: 'Natalie (Female)' },
            { id: 'en-IN-rohan', name: 'Rohan (Male)' },
            { id: 'en-IN-aarav', name: 'Aarav (Male)' }
        ];
        
        // Audio state
        this.audioContext = null;
        this.source = null;
        this.gainNode = null;
        
        // Processing state
        this.isProcessing = false;
        this.boundHandleClick = this.handleClick.bind(this);
        this.activeButtons = new Set();
    }

    init() {
        console.log('Initializing MurfService...');
        this.cleanup();
        this.setupListeners();
    }

    cleanup() {
        console.log('Cleaning up MurfService...');
        // Remove all existing listeners
        this.activeButtons.forEach(button => {
            if (button && button.removeEventListener) {
                button.removeEventListener('click', this.boundHandleClick);
            }
        });
        this.activeButtons.clear();
        this.stopExistingAudio();
    }

    setupListeners() {
        console.log('Setting up MurfService listeners...');
        const buttons = document.querySelectorAll('.convert-btn');
        buttons.forEach(button => {
            // Remove any existing listeners first
            button.removeEventListener('click', this.boundHandleClick);
            
            // Create new button to ensure clean state
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new listener
            newButton.addEventListener('click', this.boundHandleClick);
            this.activeButtons.add(newButton);
        });
    }

    async handleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const button = event.currentTarget;
        
        if (this.isProcessing) {
            console.log('Already processing, ignoring click');
            return;
        }

        try {
            this.isProcessing = true;
            button.disabled = true;

            const container = button.closest('.rapper-controls');
            if (!container) {
                throw new Error('Container not found');
            }

            const textArea = container.querySelector('.verse-input');
            const voiceSelect = container.querySelector('.voice-select');

            if (!textArea || !voiceSelect) {
                throw new Error('Form elements not found');
            }

            await this.processAudioConversion(textArea.value, voiceSelect.value);

        } catch (error) {
            console.error('Conversion error:', error);
            this.showError(error.message);
        } finally {
            this.isProcessing = false;
            button.disabled = false;
        }
    }

    async processAudioConversion(text, voiceId) {
        if (!text?.trim()) {
            throw new Error('Please enter text to convert');
        }

        console.log('Processing audio conversion...');
        await this.stopExistingAudio();

        try {
            this.showLoadingState(true);
            const response = await this.makeApiRequest(text, voiceId);
            await this.handleApiResponse(response);
        } finally {
            this.showLoadingState(false);
        }
    }

    async makeApiRequest(text, voiceId) {
        console.log('Making API request...');
        const response = await fetch(`${this.apiUrl}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.trim(), voiceId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
        }

        return response;
    }

    async handleApiResponse(response) {
        const blob = await response.blob();
        if (blob.size === 0) {
            throw new Error('Received empty audio');
        }

        const url = URL.createObjectURL(blob);
        try {
            await this.playAudio(url);
            this.showSuccess('Audio played successfully');
        } finally {
            URL.revokeObjectURL(url);
        }
    }

    async stopExistingAudio() {
        console.log('Stopping existing audio...');
        if (this.source) {
            try {
                this.source.stop();
                this.source.disconnect();
            } catch (error) {
                console.error('Error stopping source:', error);
            }
            this.source = null;
        }

        if (this.gainNode) {
            try {
                this.gainNode.disconnect();
            } catch (error) {
                console.error('Error disconnecting gain:', error);
            }
            this.gainNode = null;
        }

        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    async playAudio(url) {
        console.log('Starting audio playback...');
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        return new Promise((resolve, reject) => {
            try {
                this.source = this.audioContext.createBufferSource();
                this.source.buffer = audioBuffer;

                this.gainNode = this.audioContext.createGain();
                this.gainNode.gain.value = 1.0;

                this.source.connect(this.gainNode);
                this.gainNode.connect(this.audioContext.destination);

                this.source.onended = () => {
                    this.stopExistingAudio();
                    resolve();
                };

                this.source.start(0);
            } catch (error) {
                this.stopExistingAudio();
                reject(error);
            }
        });
    }

    showLoadingState(isLoading) {
        document.querySelectorAll('.convert-btn').forEach(btn => {
            btn.disabled = isLoading;
            btn.textContent = isLoading ? 'Converting... 🎤' : 'Convert to Audio 🎤';
        });
    }

    showError(message) {
        console.error('Error:', message);
        const notification = document.createElement('div');
        notification.className = 'murf-notification error';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showSuccess(message) {
        console.log('Success:', message);
        const notification = document.createElement('div');
        notification.className = 'murf-notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Create single instance
const murfService = new MurfService();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MurfService');
    murfService.init();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    murfService.cleanup();
});

export default murfService; 