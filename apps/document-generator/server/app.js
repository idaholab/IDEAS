// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
    res.send("OK");
})

// Deep Lynx Router
const deepLynxRouter = require('./deeplynx/router');
app.use('/deeplynx', deepLynxRouter);

// Static Assets (Temporary Development)
app.use('/assets', express.static(__dirname + '/assets'))

module.exports = app;