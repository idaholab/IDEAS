// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const deepLynxRouter = express.Router();
const bodyParser = require('body-parser');
deepLynxRouter.use(bodyParser.urlencoded({ extended: true }));
deepLynxRouter.use(express.json());

// Transformer
const DeepLynxTransformer = require('../transformers/DeepLynx/DeepLynxTransformer.js');

// Configuration
require('dotenv').config();
const host = process.env.DEEP_LYNX_ADDRESS;
const deepLynxAPIkey = process.env.DEEP_LYNX_API_KEY;
const deepLynxAPIsecret = process.env.DEEP_LYNX_API_SECRET;
const deepLynxTokenExpiry = process.env.DEEP_LYNX_TOKEN_EXPIRY;

// Routes
deepLynxRouter.get('/health', async function(req, res) {
    let transformer = new DeepLynxTransformer(host);
    let data = await transformer.getHealth();

    res.send(data);
});

deepLynxRouter.get('/get_token', async function(req, res) {
    let transformer = new DeepLynxTransformer(host);
    let token = await transformer.getToken(
        deepLynxAPIkey,
        deepLynxAPIsecret,
        deepLynxTokenExpiry
    );

    res.send(token);
});

deepLynxRouter.get('/get_containers/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);
    let containers = await transformer.getContainers();

    res.send(containers);
})

deepLynxRouter.get('/get_datasources/:container_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);
    let datasources = await transformer.getDatasources(req.params["container_id"]);

    res.send(datasources);
})

deepLynxRouter.post('/manual_import/:container_id/:datasource_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);

    let import_response = await transformer.postManualImport(
        req.params["container_id"],
        req.params["datasource_id"],
        req.body
    );

    res.send(import_response);
})

deepLynxRouter.post('/file_import/:container_id/:datasource_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);

    let file_import_receipt = await transformer.postFileImport(
        req.params["container_id"],
        req.params["datasource_id"],
        req.body
    );

    let metadata_import_receipt = await transformer.postMetadataImport(
        req.params["container_id"],
        req.params["datasource_id"],
        req.body,
        file_import_receipt[0]
    );

    res.send({"file_import_receipt": file_import_receipt, "metadata_import_receipt": metadata_import_receipt});
})

module.exports = deepLynxRouter;
