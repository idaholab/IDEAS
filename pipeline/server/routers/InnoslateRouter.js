// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const innoslateRouter = express.Router();

// Adapter
const InnoslateAdapter = require('../adapters/Innoslate/InnoslateAdapter.js');

// Configuration
require('dotenv').config()
const host = process.env.INNOSLATE_HOST;
const key = process.env.INNOSLATE_KEY;

// Routes
innoslateRouter.get('/', async function(req, res, next) {
    
    let adapter = new InnoslateAdapter(host, key);
    let data = await adapter.getObjects();

    res.send(data);
})

// GET Project Entities
innoslateRouter.get('/entities/:projId', async function(req, res, next) {
    let adapter = new InnoslateAdapter(host, key);
    let data = await adapter.extractData(req.params['projId']);

    res.send(data);
})

// GET Project Data
innoslateRouter.get('/project/:projId', async function(req, res, next) {
    let adapter = new InnoslateAdapter(host, key);
    let data = await adapter.extractData(req.params['projId']);

    res.send(data);
})

// GET Organizations
innoslateRouter.get('/organizations', async function(req, res, next) {
    let adapter = new InnoslateAdapter(host, key);
    let data = await adapter.getOrganizations();

    res.send(data);
})

module.exports = innoslateRouter;