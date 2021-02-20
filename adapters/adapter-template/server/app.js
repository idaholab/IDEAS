// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));

// App routes
app.get('/health', function(req, res) {
    res.status(200).send("OK");
})

// Deep Lynx Router
const deepLynxRouter = require('./routers/DeepLynxRouter');
app.use('/deeplynx', deepLynxRouter);

// Datasource Router
const datasourceRouter = require('./routers/DatasourceRouter');
app.use('/datasource', datasourceRouter);

module.exports = app;
