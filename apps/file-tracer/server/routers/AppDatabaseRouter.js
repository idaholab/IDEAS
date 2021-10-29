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

appDatabaseRouter.get('/get_file_elements', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let file_elements = await transformer.getFileElements();

    res.send(file_elements);
});

appDatabaseRouter.get('/get_traces', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let traces = await transformer.getTraces();

    res.send(traces);
});

appDatabaseRouter.get('/get_element_traces', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let element_traces = await transformer.getElementTraces();

    res.send(element_traces);
});

appDatabaseRouter.get('/get_asset_elements/:asset_id/:file_id', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let asset_elements = await transformer.getAssetElements(req.params["asset_id"], req.params["file_id"]);

    res.send(asset_elements);
});

appDatabaseRouter.get('/add_asset/:dlID', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let asset = await transformer.addAsset(req.params["dlID"]);

    res.send(asset);
});

appDatabaseRouter.get('/add_file/:dlID', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let file = await transformer.addFile(req.params["dlID"]);

    res.send(file);
});

appDatabaseRouter.get('/add_file_element/:dlID/:idx', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let file_element = await transformer.addFileElement(req.params["dlID"], req.params["idx"]);

    res.send(file_element);
});

appDatabaseRouter.get('/add_trace/:assetId/:fileId', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let trace = await transformer.addTrace(
        req.params["assetId"],
        req.params["fileId"]
    );

    res.send(trace);
});

appDatabaseRouter.get('/add_element_trace/:assetId/:fileElementId', async function(req, res) {
    let transformer = new AppDatabaseTransformer();
    let element_trace = await transformer.addElementTrace(
        req.params["assetId"],
        req.params["fileElementId"]
    );

    res.send(element_trace);
});

module.exports = appDatabaseRouter;
