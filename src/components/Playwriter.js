import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

const PlayWriter = () => {
    const [lines, setLines] = useState([{ character: '', gender: 'male', text: '' }]);
    const [isDisabled, setIsDisabled] = useState(false);

    const addLine = () => {
        if (lines.length < 5) {
            setLines([...lines, { character: '', gender: 'male', text: '' }]);
        }
        if (lines.length >= 4) {
            setIsDisabled(true);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        setLines(newLines);
    };

    const handleSubmit = async () => {
        try {
            const uniqueCharacters = [...new Set(lines.map(line => line.character))];
            const characterVoices = {};

            // Fetch voices from Eleven Labs API
            const voiceResponse = await axios.get('https://api.elevenlabs.io/v1/voices', {
                headers: {
                    'Accept': 'application/json',
                    'xi-api-key': process.env.NEXT_PUBLIC_XI_API_KEY
                }
            });
            const voices = voiceResponse.data.voices;

            // Assign voice ids to characters based on gender
            uniqueCharacters.forEach(character => {
                const gender = lines.find(line => line.character === character).gender;
                const availableVoices = voices.filter(voice => voice.labels.gender === gender);
                const selectedVoice = availableVoices[Math.floor(Math.random() * availableVoices.length)];
                characterVoices[character] = selectedVoice.voice_id;
            });

            // Prepare the voice assignments
            const voiceAssignments = lines.map(line => ({
                text: line.text,
                voice_id: characterVoices[line.character]
            }));

            // Save the script to a file
            const script = lines.map(line => `${line.character}: ${line.text}`).join('\n');
            await axios.post('/api/saveScript', { script });

            // Generate TTS for the full script and save as a single MP3 file
            const response = await axios.post('/api/generateAudio', {
                voices: voiceAssignments
            });

            const audioUrl = response.data.filePath;
            const audio = new Audio(audioUrl);
            audio.play();

            // Clear the form after successful submission
            setLines([{ character: '', gender: 'male', text: '' }]);
            setIsDisabled(false);

            alert('Play submitted successfully, click OK to listen to the audio.');
        } catch (error) {
            console.error('Error submitting play:', error);
            alert('An error occurred while submitting the play. Please try again.');
        }
    };

    return (
        <div className={styles.playWriterContainer}>
            {lines.map((line, index) => (
                <div key={index} className={styles.lineItem}>
                    <input
                        type="text"
                        value={line.character}
                        onChange={(e) => handleInputChange(index, 'character', e.target.value)}
                        placeholder="Character Name"
                        className={styles.inputField}
                    />
                    <select
                        value={line.gender}
                        onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input
                        type="text"
                        value={line.text}
                        onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                        placeholder="Line"
                        className={styles.inputField}
                    />
                </div>
            ))}
            <button onClick={addLine} disabled={isDisabled} className={styles.button}>Add New Line</button>
            <button onClick={handleSubmit} className={styles.button}>Submit</button>
        </div>
    );
};

export default PlayWriter;