import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { IProcessEnv } from './interfaces/IProcessEnv';
import { DLVars } from './types/DLVars';
import { DeepLynxServer } from './classes/DeepLynxServer';

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.DEEP_LYNX_PORT!);
const host: string = env_vars.DEEP_LYNX_URL!;

const dl_vars: DLVars = [
  env_vars.DEEP_LYNX_KEY!,
  env_vars.DEEP_LYNX_SECRET!,
  env_vars.DEEP_LYNX_EXPIRY!
];

const app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Deep Lynx backend service" });
});

app.get('/health', function(req, res) {
  res.status(200).send({ 'value': "OK" });
});

app.get('/get_token/:key/:secret', async function(req, res) {
    let dlserver = new DeepLynxServer(host);
    let token = await dlserver.getToken(
        req.params["key"],
        req.params["secret"],
        dl_vars[2]
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

app.listen(port, () => {
  console.log(`Deep Lynx server running on port ${port}`);
});
