import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';

import { IProcessEnv } from './interfaces/IProcessEnv';
import { DLVars } from './types/DLVars';
import { DeepLynxServer } from './classes/DeepLynxServer';

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.DEEP_LYNX_PORT!);
const host: string = env_vars.DEEP_LYNX_URL!;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

var upload = multer();

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Deep Lynx backend service" });
});

app.get('/health', async function(req, res) {
  let dlserver = new DeepLynxServer(host);
  let health = await dlserver.getHealth()

  res.status(200).send([{'value': health[0]}]);
});

app.get('/get_token/:key/:secret', async function(req, res) {
    let dlserver = new DeepLynxServer(host);
    let token = await dlserver.getToken(
        req.params["key"],
        req.params["secret"],
        '1hr'
    );

    res.send(token);
});

app.get('/get_containers/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let containers = await dlserver.getContainers();

    res.send(containers);
});

app.get('/get_files/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let files = await dlserver.getFiles(req.params["container_id"]);

    res.send(files);
});

app.get('/get_datasources/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let datasources = await dlserver.getDatasources(req.params["container_id"]);

    res.send(datasources);
});

app.get('/get_metatype_definition/:container_id/:metatype_name/:token', async function (req, res) {
  let dlserver = new DeepLynxServer(host, req.params["token"]);
  let metatype_definition = await dlserver.getMetatypeDefinition(
    req.params["container_id"],
    req.params["metatype_name"]
  )

  res.send(metatype_definition)
});

app.get('/get_links/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let links = await dlserver.getNodes(req.params["container_id"], "Link");

    res.send(links);
});

app.get('/get_assets/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let assets = await dlserver.getNodes(req.params["container_id"], "Asset");

    res.send(assets);
});

app.get('/get_requirements/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let requirements = await dlserver.getNodes(
      req.params["container_id"],
      "Requirement"
    );

    res.send(requirements);
});

app.get('/get_nodes/:node_name/:container_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let nodes = await dlserver.getNodes(
      req.params["container_id"],
      req.params["node_name"]
    );

    res.send(nodes);
});

app.post('/query/:container_id/:token', async function(req, res) {
  let dlserver = new DeepLynxServer(host, req.params["token"]);
  let query_response = await dlserver.query(
    req.params["container_id"],
    req.body
  )

  res.send(query_response);
})

app.post('/post_object/:container_id/:datasource_id/:token', async function (req, res) {
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let post_response = await dlserver.postObject(
      req.params["container_id"],
      req.params["datasource_id"],
      req.body
    )

    res.send(post_response);
});

app.post('/post_files/:container_id/:datasource_id/:token', upload.any(), async function (req, res) {
  console.log(req.params["token"])
    let dlserver = new DeepLynxServer(host, req.params["token"]);
    let post_response = await dlserver.postFiles(
      req.params["container_id"],
      req.params["datasource_id"],
      req.files
    )

    res.send(post_response);

});

app.listen(port, () => {
  console.log(`Deep Lynx server running on port ${port}`);
});
