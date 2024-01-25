const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_API = 'http://a03f3783a4f8a4745b529e39c1416ba9-927245827.us-east-1.elb.amazonaws.com'

// Enable CORS
const allowedOrigins = [
    'https://spyndle.surge.sh',
    'http://localhost:3000',
    'http://localhost:5173'
]
console.log('---------------------------- testA')
app.use(cors({
    origin: function (origin, callback) {
        console.log('---------------- test1', origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('---------------- test2', origin)
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        console.log('---------------- test3', origin)
        return callback(null, true);
    }
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.all('*', async (req, res) => {
    console.log('--------------- got request')
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
