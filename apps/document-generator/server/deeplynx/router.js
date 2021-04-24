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
    res.send("OK")
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

deepLynxRouter.post('/containers', async function(req, res) {
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
    let metatype_id = req.body.metatype_id;

    let nodes = await axios.get(
        `${host}/containers/${container_id}/graphs/nodes/metatype/${metatype_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    ).then(response => {
        return response.data.value;
    }).catch(() => {
        res.status(500).send();
    });

    res.send(nodes);
})

deepLynxRouter.post('/metatype', async function(req, res) {
    let token = req.body.token;
    let container_id = req.body.container_id;

    let metaypes = await axios.get(
        `${host}/containers/${container_id}/metatypes/`, {
            params: {
                name: 'Document'
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    ).then(response => {
        return response.data.value
    }).catch(() => {
        res.status(500).send();
    })

    res.send(metaypes)
})

module.exports = deepLynxRouter;