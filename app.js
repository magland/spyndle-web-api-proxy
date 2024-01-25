const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_API = 'http://a03f3783a4f8a4745b529e39c1416ba9-927245827.us-east-1.elb.amazonaws.com'

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.all('*', async (req, res) => {
    try {
        const targetUrl = TARGET_API + req.originalUrl;

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: { ...req.headers, 'host': new URL(targetUrl).host },
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error);
        res.status(500).send('Error forwarding request');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
