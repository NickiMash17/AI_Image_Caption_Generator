const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Load environment variables from .env file
require('dotenv').config();
// Make sure you have a .env file in your project root with:
// OPENAI_API_KEY=sk-proj-your_actual_openai_api_key_here

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/caption', async (req, res) => {
    const { image } = req.body;
    console.log('Received image (first 100 chars):', image ? image.substring(0, 100) : 'NO IMAGE');
    if (!image) {
        return res.status(400).json({ error: 'No image provided.' });
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'Describe this image in a detailed caption.' },
                            { type: 'image_url', image_url: { "url": `data:image/jpeg;base64,${image}` } }
                        ]
                    }
                ],
                max_tokens: 100
            })
        });
        const data = await response.json();
        console.log('OpenAI API response:', data); // Log the full response
        if (data.choices && data.choices.length > 0) {
            res.json({ caption: data.choices[0].message.content });
        } else {
            // Log error details from OpenAI API if present
            const apiError = data.error ? data.error.message : JSON.stringify(data);
            console.error('OpenAI API error:', apiError);
            res.status(500).json({ error: `Failed to generate caption. OpenAI API error: ${apiError}` });
        }
    } catch (error) {
        console.error('Server error:', error); // Log the error
        res.status(500).json({ error: 'Server error.' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app; 