import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const deleteFolderRecursive = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recurse
                deleteFolderRecursive(curPath);
            } else {
                // Delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { voices } = req.body;
        const outputFilePath = path.join(process.cwd(), 'public', 'output.mp3');
        const tempDir = path.join(process.cwd(), 'temp');
        const concatFilePath = path.join(tempDir, 'filelist.txt');

        // Create a temporary directory for storing individual audio files
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        try {
            const audioFilePaths = [];

            for (let i = 0; i < voices.length; i++) {
                const { text, voice_id } = voices[i];
                const tempFilePath = path.join(tempDir, `temp_${i}.mp3`);

                const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`, {
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.8,
                        style: 0.0,
                        use_speaker_boost: true
                    }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'xi-api-key': process.env.NEXT_PUBLIC_XI_API_KEY
                    },
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(tempFilePath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                audioFilePaths.push(tempFilePath);
            }

            // Write the file paths to the concat file
            const concatFileContent = audioFilePaths.map(filePath => `file '${filePath}'`).join('\n');
            fs.writeFileSync(concatFilePath, concatFileContent);

            // Concatenate all the audio files into a single MP3
            ffmpeg()
                .input(concatFilePath)
                .inputOptions('-f', 'concat', '-safe', '0')
                .output(outputFilePath)
                .on('end', () => {
                    // Clean up temporary files
                    deleteFolderRecursive(tempDir);

                    res.status(200).json({ message: 'Audio generated successfully', filePath: '/output.mp3' });
                })
                .on('error', (err) => {
                    console.error('Error during concatenation:', err);
                    res.status(500).json({ message: 'Error concatenating audio files', error: err.message });
                })
                .run();
        } catch (error) {
            console.error('Error generating audio:', error);
            res.status(500).json({ message: 'Error generating audio', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}