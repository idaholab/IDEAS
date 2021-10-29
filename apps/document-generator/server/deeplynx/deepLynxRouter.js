// Express
const express = require('express');
const deepLynxRouter = express.Router();
const bodyParser = require('body-parser');
deepLynxRouter.use(bodyParser.urlencoded({ extended: true }));
deepLynxRouter.use(express.json());

// Axios
const axios = require('axios');

// Lodash
const {map, sortBy, filter} = require('lodash');

// Configuration
require('dotenv').config();
const host = process.env.DEEP_LYNX_ADDRESS;
const deepLynxAPIkey = process.env.DEEP_LYNX_API_KEY;
const deepLynxAPIsecret = process.env.DEEP_LYNX_API_SECRET;
const deepLynxTokenExpiry = process.env.DEEP_LYNX_TOKEN_EXPIRY;

deepLynxRouter.get('/health', async function(req, res) {
    await axios.get(`${host}/health`).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(`Deep Lynx not found on ${host}`)
        res.sendStatus(500);
    });
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
        return filter(response.data.value, {"metatype_name": "Document"});
    }).catch(() => {
        res.status(500).send();
    });

    res.send(nodes);
})

deepLynxRouter.post('/graph', async function(req, res) {
    let graph = {
        document: req.body.node,
        nodes: []
    };
    let token = req.body.token;
    let container_id = req.body.container_id;
    let origin_node = req.body.node;

    // Retrieve all edges in the target container
    let edges = await axios.get(
        `${host}/containers/${container_id}/graphs/edges`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    ).then(response => {
        return response.data.value;
    }).catch(() => {
        res.status(500).send();
    })

    // For each edge, beginning with only those having an origin at the origin node, find all the related nodes
    for(edge of edges) {
        if(edge.origin_node_id == origin_node.id) {
            await axios.get(
                `${host}/containers/${container_id}/graphs/nodes/${edge.destination_node_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then(response => {
                // Pick only the node's properties, the actual data of interest
                let node = response.data.value;
                if (node.properties.id != origin_node.properties.id) {
                    graph.nodes.push(node.properties);
                }
            }).catch(() => {
                res.status(500).send();
            });
        }
    }

    // Sort the section nodes in the order of section number
    graph.nodes = map(sortBy(graph.nodes, 'number'))
    res.send(graph);

})



module.exports = deepLynxRouter;