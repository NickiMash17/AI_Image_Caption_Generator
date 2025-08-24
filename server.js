const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/caption', async (req, res) => {
    const { image } = req.body;
    console.log('Received image (first 100 chars):', image ? image.substring(0, 100) : 'NO IMAGE');
    
    if (!image) {
        return res.status(400).json({ error: 'No image provided.' });
    }

    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const tempFilename = `temp_${Date.now()}.jpg`;
    const tempFilePath = path.join(__dirname, tempFilename);

    try {
        // Save base64 image to temporary file
        fs.writeFileSync(tempFilePath, base64Data, 'base64');
        
        const form = new FormData();
        form.append('file', fs.createReadStream(tempFilePath));

        console.log('Calling Hugging Face API...');
        console.log('Using model: nlpconnect/vit-gpt2-image-captioning');
        console.log('API Token present:', !!process.env.HF_API_TOKEN);
        
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
                },
                timeout: 60000,
            }
        );

        // Clean up temporary file
        fs.unlinkSync(tempFilePath);

        console.log('Hugging Face API response status:', response.status);
        console.log('Hugging Face API response data:', response.data);

        if (response.data && response.data.length > 0 && response.data[0].generated_text) {
            const caption = response.data[0].generated_text;
            console.log('Generated caption:', caption);
            res.json({ caption });
        } else {
            console.log('No caption generated from response');
            res.json({ caption: 'No caption could be generated from this image.' });
        }

    } catch (error) {
        // Clean up temporary file if it exists
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                timeout: error.config?.timeout,
                hasAuth: !!error.config?.headers?.Authorization
            }
        });

        let errorMessage = 'Failed to generate caption';
        let errorDetails = error.message;

        if (error.response) {
            if (error.response.status === 403) {
                errorMessage = 'Access denied. Please check your Hugging Face API token permissions.';
                errorDetails = 'The model requires proper authentication or the token lacks inference permissions.';
            } else if (error.response.status === 429) {
                errorMessage = 'Rate limit exceeded. Please try again later.';
                errorDetails = 'Too many requests to the Hugging Face API.';
            } else if (error.response.status === 500) {
                errorMessage = 'Model server error. Please try again later.';
                errorDetails = 'Internal server error from Hugging Face.';
            } else {
                errorMessage = `API Error (${error.response.status})`;
                errorDetails = error.response.data?.error || error.response.statusText;
            }
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. The model is taking too long to respond.';
            errorDetails = 'Request exceeded 60 second timeout.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'Network error. Please check your internet connection.';
            errorDetails = 'Could not reach Hugging Face servers.';
        }

        console.error('Final error response:', { errorMessage, errorDetails });
        res.status(500).json({ 
            error: errorMessage, 
            details: errorDetails,
            suggestion: 'Try using a different image or check your API token permissions.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        hasApiToken: !!process.env.HF_API_TOKEN
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('API Token configured:', !!process.env.HF_API_TOKEN);
    console.log('Using model: nlpconnect/vit-gpt2-image-captioning');
}); 