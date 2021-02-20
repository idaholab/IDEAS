// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const datasourceRouter = express.Router();

// Adapter
const DatasourceTransformer = require('../transformers/DatasourceTransformer.js');

// Configuration
require('dotenv').config()
const host = process.env.DATASOURCE_HOST;
const key = process.env.DATASOURCE_KEY;

// Routes
datasourceRouter.get('/get_all_users', async function(req, res, next) {

    let transformer = new DatasourceTransformer(host, key);
    let data = await transformer.getAllUsers();

    res.send(data);
})

datasourceRouter.get('/get_all_posts', async function(req, res, next) {

    let transformer = new DatasourceTransformer(host, key);
    let data = await transformer.getAllPosts();

    res.send(data);
})

datasourceRouter.get('/get_single_post/:id', async function(req, res, next) {

    let transformer = new DatasourceTransformer(host, key);
    let data = await transformer.getSinglePost(req.params['id']);

    res.send(data);
})

module.exports = datasourceRouter;
