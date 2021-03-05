// Copyright 2021;, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const vaultRouter = express.Router();

// Adapter
const VaultTransformer = require('../transformers/Vault/VaultTransformer.js');

// Configuration
require('dotenv').config()

const host = process.env.VAULT_HOST;
const username = process.env.VAULT_USERNAME;
const password = process.env.VAULT_PASSWORD;
const vault = process.env.VAULT_NAME;

// Routes
vaultRouter.get('/authenticate', async function(req, res) {
    let transformer = new VaultTransformer(host);
    let url = await transformer.makeAuthURL(username, password, vault);
    let {token, user_id} = await transformer.getTokenAndUser(url);
    res.send({"token": token, "user_id": user_id});
})




// datasourceRouter.get('/get_single_user/:id', async function(req, res) {
//
//     let transformer = new DatasourceTransformer(host, key);
//     let user = await transformer.getSingleUser(req.params["id"]);
//
//     res.send(user);
// })
//
// datasourceRouter.get('/get_all_posts', async function(req, res) {
//
//     let transformer = new DatasourceTransformer(host, key);
//     let post_list = await transformer.getAllPosts();
//
//     res.send(post_list);
// })
//
// datasourceRouter.get('/get_single_post/:id', async function(req, res) {
//
//     let transformer = new DatasourceTransformer(host, key);
//     let post = await transformer.getSinglePost(req.params['id']);
//
//     res.send(post);
// })

module.exports = vaultRouter;
