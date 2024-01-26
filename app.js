const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_API = 'ae5a8a16ba119482392d961a26af51d1-1282530926.us-east-1.elb.amazonaws.com'


// Enable CORS
const allowedOrigins = [
    'https://spyndle.surge.sh',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://spyndle.vercel.app'
]
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

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
