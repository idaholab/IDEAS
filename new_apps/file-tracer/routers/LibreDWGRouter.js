// Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const libreDWGRouter = express.Router();
const bodyParser = require('body-parser');

libreDWGRouter.use(
    bodyParser.urlencoded({ extended: true, limit: '500mb' })
);
libreDWGRouter.use(
    bodyParser.json({ extended: true, limit: '500mb' })
);
libreDWGRouter.use(express.json());

// Transformer
const LibreDWGTransformer = require('../transformers/LibreDWG/LibreDWGTransformer.js');

// Routes
libreDWGRouter.get('/health', async function(req, res) {
    let transformer = new LibreDWGTransformer();
    transformer.healthCheck().then( response => {
        if (response.stdout != '') {
            res.status(200).send("OK");
        } else {
            res.status(500).send("FAIL");
        }
    });
});

libreDWGRouter.get('/ls', async function(req, res) {
    let transformer = new LibreDWGTransformer();
    transformer.ls().then( response => {
        if (response.stdout != '') {
            res.status(200).send(response.stdout);
        } else {
            res.status(500).send("FAIL");
        }
    });
});

libreDWGRouter.get('/file_string', async function(req, res) {
    let transformer = new LibreDWGTransformer();
    let response = await transformer.stream();

    response.stdout.pipe(res);
});

libreDWGRouter.post('/file_obj', async function(req, res) {
    let transformer = new LibreDWGTransformer();
    let response = await transformer.convert(req.body["file_string"]);

    res.status(200).send(response)
});


module.exports = libreDWGRouter;
