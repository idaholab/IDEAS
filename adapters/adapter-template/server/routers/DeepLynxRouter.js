// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const deepLynxRouter = express.Router();

// Transformer
const DeepLynxTransformer = require('../transformers/DeepLynxTransformer.js');

// Configuration
require('dotenv').config()
const host = process.env.DEEP_LYNX_ADDRESS;
const deepLynxAPIkey = process.env.DEEP_LYNX_API_KEY
const deepLynxAPIsecret = process.env.DEEP_LYNX_API_SECRET
const deepLynxTokenExpiry = process.env.DEEP_LYNX_TOKEN_EXPIRY

// Routes
deepLynxRouter.get('/health', async function(req, res, next) {

    let transformer = new DeepLynxTransformer(host);
    let data = await transformer.getHealth();

    res.send(data);
})

deepLynxRouter.get('/get_token', async function(req, res, next) {

    let transformer = new DeepLynxTransformer(host);
    let data = await transformer.getToken(
      deepLynxAPIkey,
      deepLynxAPIsecret,
      deepLynxTokenExpiry
    );

    res.send(data);
})

module.exports = deepLynxRouter;
