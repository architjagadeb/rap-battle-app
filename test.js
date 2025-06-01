import fs from "fs";
import axios from "axios";

async function testMurfVoices() {
    const apiUrl = "https://api.murf.ai/v1/speech/stream";
    const apiKey = "ap2_093e98b6-fffd-4a8d-b5b7-b4bd62e57892";

    // Test different voices
    const voices = [
        { text: "Hello, I am Natalie!", voiceId: "en-US-natalie" },
        { text: "Hello, I am Rohan!", voiceId: "en-IN-rohan" },
        { text: "Hello, I am Aarav!", voiceId: "en-IN-aarav" }
    ];

    for (const voice of voices) {
        try {
            console.log(`Testing voice: ${voice.voiceId}`);
            
            const response = await axios.post(apiUrl, 
                {
                    text: voice.text,
                    voiceId: voice.voiceId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": apiKey
                    },
                    responseType: "stream"
                }
            );

            const outputFilePath = `./${voice.voiceId}.wav`;
            const writer = fs.createWriteStream(outputFilePath);

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", () => {
                    console.log(`✅ Audio saved to ${outputFilePath}`);
                    resolve();
                });

                writer.on("error", (err) => {
                    console.error(`❌ Error writing to file for ${voice.voiceId}:`, err);
                    reject(err);
                });
            });

        } catch (error) {
            console.error(`❌ Error with voice ${voice.voiceId}:`, error.message);
        }
    }
}

// Run the test
console.log('🎤 Starting Murf AI voice tests...');
testMurfVoices()
    .then(() => console.log('✨ All tests completed'))
    .catch(err => console.error('💥 Test failed:', err)); 