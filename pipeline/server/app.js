// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();

// Configuration
require('dotenv').config();
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));

app.get('/healthcheck', function(req, res) {
    res.status(200).send();
})

// Innoslate Router
const innoslateRouter = require('./routers/InnoslateRouter');
app.use('/innoslate', innoslateRouter);

module.exports = app;