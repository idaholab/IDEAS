// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const innoslateRouter = express.Router();

// Transformer
const InnoslateTransformer = require('../transformers/Innoslate/InnoslateTransformer.js');

// Configuration
require('dotenv').config()
const host = process.env.INNOSLATE_HOST;
const key = process.env.INNOSLATE_KEY;

// Routes
innoslateRouter.get('/', async function(req, res, next) {

    let adapter = new InnoslateTransformer(host, key);
    let data = await adapter.getObjects();

    res.send(data);
})

// GET Document Data
innoslateRouter.get('/document-data/:projId', async function(req, res, next) {
    let adapter = new InnoslateTransformer(host, key);
    let data = await adapter.extractDocument(req.params['projId']);

    res.send({"document_entities": data.flatEntities});
})

// GET Non-Document Data
innoslateRouter.get('/non-document-data/:projId', async function(req, res, next) {
    let adapter = new InnoslateTransformer(host, key);
    let data = await adapter.extractNonDocument(req.params['projId']);

    res.send(data);
})

module.exports = innoslateRouter;
