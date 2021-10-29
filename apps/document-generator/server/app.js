// Express
const express = require('express');
const app = express();

// Axios
const axios = require('axios');

// Lodash
const _ = require('lodash');

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const serveStatic = require('serve-static');

// Healthcheck
app.get('/healthcheck', (req, res) => {
    res.send("OK");
})

// Deep Lynx Router
const deepLynxRouter = require('./deeplynx/deepLynxRouter');
app.use('/deeplynx', deepLynxRouter);

// Generator Router
const generatorRouter = require('./generator/generatorRouter');
app.use('/generate', generatorRouter);

app.get('/fonts', async (req, res) => {
    let fonts = await axios.get(`https://www.googleapis.com/webfonts/v1/webfonts`, {
        params: {
            key: process.env.GOOGLE_KEY,
            sort: "popularity"
        }
    }).then(response => {
        return _.take(response.data.items, 10);
    })
    res.send(fonts);
})

// Static Assets (Temporary Development)
app.use('/assets', express.static(__dirname + '/generator/files'))

module.exports = app;
