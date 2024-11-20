const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

const ApiError = require('./errors/ApiError');
const configs = require('./configs/configs');
const router = require('./routes');

// Create an Express application
const app = express();

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    origin: configs.CLIENT_URL,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Token', 'X-Sign']
}));

app.use('/api', router);

app.get('/', (req, res) => {
    res.json('WELCOME:)');
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create HTTP server
const server = http.createServer(app);


// Start the server
server.listen(configs.PORT || 5000, configs.HOST, async () => {
    await mongoose.connect(configs.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`Backend server is running on port ${configs.PORT} !`);
});