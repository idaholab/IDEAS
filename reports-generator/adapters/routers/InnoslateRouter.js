// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const innoslateRouter = express.Router();

// Adapter
const InnoslateAdapter = require('../Innoslate/InnoslateAdapter');

// Configuration
require('dotenv').config()
const host = process.env.INNOSLATE_HOST;
const port = process.env.INNOSLATE_PORT;

// Route
innoslateRouter.get('/:projId', async function(req, res, next) {

    let adapter = new InnoslateAdapter(host, port);
    let data = await adapter.get(req.params['projId']);

    res.send(data);

})

module.exports = innoslateRouter;