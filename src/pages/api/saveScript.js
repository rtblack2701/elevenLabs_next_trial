import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { script } = req.body;
        const filePath = path.join(process.cwd(), 'public', 'playScript.txt');

        fs.writeFile(filePath, script, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to write file' });
            }
            res.status(200).json({ message: 'File written successfully' });
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}