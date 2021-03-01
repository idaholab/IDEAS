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
datasourceRouter.get('/get_all_users', async function(req, res) {

    let transformer = new DatasourceTransformer(host, key);
    let user_list = await transformer.getAllUsers();

    res.send(user_list);
})

datasourceRouter.get('/get_single_user/:id', async function(req, res) {

    let transformer = new DatasourceTransformer(host, key);
    let user = await transformer.getSingleUser(req.params["id"]);

    res.send(user);
})

datasourceRouter.get('/get_all_posts', async function(req, res) {

    let transformer = new DatasourceTransformer(host, key);
    let post_list = await transformer.getAllPosts();

    res.send(post_list);
})

datasourceRouter.get('/get_single_post/:id', async function(req, res) {

    let transformer = new DatasourceTransformer(host, key);
    let post = await transformer.getSinglePost(req.params['id']);

    res.send(post);
})

module.exports = datasourceRouter;
