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
});

vaultRouter.get("/get_item_list/:token/:user_id", async function(req, res) {
    let transformer = new VaultTransformer(host);
    let token = req.params["token"];
    let user_id = req.params["user_id"];
    let items = await transformer.getItems(token, user_id);
    res.send(items);
});

vaultRouter.get("/get_single_item_history/:token/:user_id/:item_id", async function(req, res) {
    let transformer = new VaultTransformer(host);
    let token = req.params["token"];
    let user_id = req.params["user_id"];
    let item_id = req.params["item_id"];
    let item = await transformer.getSingleItemHistory(token, user_id, item_id);
    res.send(item);
});

vaultRouter.get("/get_single_item_latest/:token/:user_id/:item_id", async function(req, res) {
    let transformer = new VaultTransformer(host);
    let token = req.params["token"];
    let user_id = req.params["user_id"];
    let item_id = req.params["item_id"];
    let item = await transformer.getSingleItemLatest(token, user_id, item_id);
    res.send(item);
});

vaultRouter.get("/get_file_list/:token/:user_id", async function(req, res) {
    let transformer = new VaultTransformer(host);
    let token = req.params["token"];
    let user_id = req.params["user_id"];
    let items = await transformer.getItems(token, user_id);
    let files = await transformer.getFiles(token, user_id, items.ids);
    res.send(files);
});




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
