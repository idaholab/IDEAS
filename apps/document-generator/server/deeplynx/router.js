// Express
const express = require('express');
const deepLynxRouter = express.Router();
const bodyParser = require('body-parser');
deepLynxRouter.use(bodyParser.urlencoded({ extended: true }));
deepLynxRouter.use(express.json());

// Axios
const axios = require('axios');

// Configuration
require('dotenv').config();
const host = process.env.DEEP_LYNX_ADDRESS;
const deepLynxAPIkey = process.env.DEEP_LYNX_API_KEY;
const deepLynxAPIsecret = process.env.DEEP_LYNX_API_SECRET;
const deepLynxTokenExpiry = process.env.DEEP_LYNX_TOKEN_EXPIRY;


deepLynxRouter.get('/health', async function(req, res) {
    let health = await axios.get(
            `${process.env.DEEP_LYNX_ADDRESS}/health`
        ).then(() => {
            res.status(200).send();
        }).catch(() => {
            res.status(500).send();
        });

    res.send(health);
})

deepLynxRouter.get('/token', async function(req, res) {
    let token = await axios.get(`${host}/oauth/token`, {
        headers: {
            'x-api-key': deepLynxAPIkey,
            'x-api-secret': deepLynxAPIsecret,
            'x-api-expiry': deepLynxTokenExpiry
        }
        }).then(response => {
            return response.data
        });

    res.send(token);
});

deepLynxRouter.get('/containers', async function(req, res) {
    let token = req.body.token;

    let containers = await axios.get(`${host}/containers?offset=0&limit=100`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    ).then(response => {
        return response.data.value;
    });
    
    res.send(containers);
})

deepLynxRouter.post('/nodes', async function(req, res) {
    let token = req.body.token;
    let container_id = req.body.container_id;

    let nodes = await axios.get(
        `${host}/containers/${container_id}/graphs/nodes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    ).then(response => {
        return response.data.value;
    });

    res.send(nodes);
})

module.exports = deepLynxRouter;