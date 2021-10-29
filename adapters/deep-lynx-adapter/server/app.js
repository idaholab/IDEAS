// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// App routes
app.get('/health', function(req, res) {
    res.status(200).send("OK");
})

// Deep Lynx Router
const deepLynxRouter = require('./routers/DeepLynxRouter');
app.use('/deeplynx', deepLynxRouter);

// Innoslate Router
const innoslateRouter = require('./routers/InnoslateRouter');
app.use('/innoslate', innoslateRouter);

// Vault Router
const vaultRouter = require('./routers/VaultRouter');
app.use('/vault', vaultRouter);

module.exports = app;
