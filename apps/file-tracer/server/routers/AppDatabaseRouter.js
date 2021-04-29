// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const appDatabaseRouter = express.Router();
const bodyParser = require('body-parser');
appDatabaseRouter.use(bodyParser.urlencoded({ extended: true }));
appDatabaseRouter.use(express.json());

// Transformer
const AppDatabaseTransformer = require('../transformers/AppDatabase/AppDatabaseTransformer.js');

// Configuration
// require('dotenv').config();
// const host = process.env.DEEP_LYNX_ADDRESS;
// const deepLynxAPIkey = process.env.DEEP_LYNX_API_KEY;
// const deepLynxAPIsecret = process.env.DEEP_LYNX_API_SECRET;
// const deepLynxTokenExpiry = process.env.DEEP_LYNX_TOKEN_EXPIRY;

// Routes
appDatabaseRouter.get('/health', async function(req, res) {
    let transformer = new DeepLynxTransformer(host);
    let message = await transformer.getHealth();

    res.send(message);
});

module.exports = appDatabaseRouter;
