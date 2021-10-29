// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const deepLynxRouter = express.Router();
const bodyParser = require('body-parser');
const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
deepLynxRouter.use(bodyParser.urlencoded({ extended: true }));
deepLynxRouter.use(express.json());

// Transformers
const DeepLynxTransformer = require('../transformers/DeepLynx/DeepLynxTransformer.js');
const LibreDWGTransformer = require('../transformers/LibreDWG/LibreDWGTransformer.js');

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

deepLynxRouter.get('/download_file/:container_id/:file_id/:token', async function (req, res) {
  // let tmpDir = tmp.dirSync({unsafeCleanup: true})
  // let output_path = path.join(tmpDir.name, 'temp.dwg');
  //
  // let dl_transformer = new DeepLynxTransformer(host, req.params["token"]);
  let dwg_transformer = new LibreDWGTransformer();
  //
  // let file_message = await dl_transformer.downloadFile(req.params["container_id"], req.params["file_id"], output_path)
  let response = dwg_transformer.stream('transformers/LibreDWG/test.dwg');

  response.stdout.pipe(res);

});


module.exports = deepLynxRouter;
