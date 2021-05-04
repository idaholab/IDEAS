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
    let transformer = new AppDatabaseTransformer();
    if (await transformer.connectionIsOpen()) {
        res.status(200).send("OK")
    } else {
        res.status(500).send("FAIL")
    }
});

appDatabaseRouter.get('/get_assets', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let assets = await transformer.getAssets();

    res.send(assets);
});

appDatabaseRouter.get('/get_files', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let files = await transformer.getFiles();

    res.send(files);
});

appDatabaseRouter.get('/get_traces', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let traces = await transformer.getTraces();

    res.send(traces);
});

appDatabaseRouter.get('/add_asset/:name/:dlID', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    await transformer.addAsset(req.params["name"], req.params["dlID"])

    res.send("Asset added")
});

module.exports = appDatabaseRouter;
