// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();

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