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
    let message = await transformer.getHealth();

    res.send(message);
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
});

deepLynxRouter.get('/get_files/:container_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);
    let files = await transformer.getFiles(req.params["container_id"]);

    res.send(files);
});

deepLynxRouter.get('/get_links/:container_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);
    let links = await transformer.getNodes(req.params["container_id"], "Link");

    res.send(links);
});

deepLynxRouter.get('/get_assets/:container_id/:token', async function (req, res) {
    let transformer = new DeepLynxTransformer(host, req.params["token"]);
    let assets = await transformer.getNodes(req.params["container_id"], "Asset");

    res.send(assets);
});

module.exports = deepLynxRouter;
