import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authenticate from './scripts/authenticate';
import getRequirements from './scripts/requirements';
import entityFactory from './scripts/factory';

import { IProcessEnv } from './interfaces/IProcessEnv';
import { Innoslate } from './classes/Innoslate';

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.INNOSLATE_ADAPTER_PORT!);

const app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Innoslate requirements adapter" });
});

app.get('/health', function(req, res) {
  res.status(200).send([{ 'value': "OK" }]);
});

app.get('/list_organizations/:key', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["key"]);
  let organizations = await innoslate.get_organizations();
  res.status(200).send([{ 'organizations': organizations }]);
});

app.get('/list_projects/:organization/:key', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["key"]);
  let projects = await innoslate.get_projects(req.params["organization"]);
  res.status(200).send([{ 'projects': projects}]);
});

app.get('/get_deeplynx_requirements/:inno_key/:dl_key/:dl_secret/:dl_container_id', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["inno_key"]);

  let token = await innoslate.get_deeplynx_token(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_key"],
    req.params["dl_secret"]
  );

  let requirements = await innoslate.get_deeplynx_requirements(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_container_id"],
    token
  );

  res.status(200).send([{'requirements':requirements}]);
});

app.get('/get_innoslate_requirements/:inno_key/:organization/:project', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["inno_key"]);

  let requirements = await innoslate.get_innoslate_requirements(
    req.params["organization"],
    req.params["project"]
  );

  res.status(200).send([{'requirements':requirements}]);
});

app.get('/push_innoslate_requirements_to_dl/:inno_key/:organization/:project/:dl_key/:dl_secret/:dl_container_id/:dl_datasource_id', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["inno_key"]);

  let requirements = await innoslate.get_innoslate_requirements(
    req.params["organization"],
    req.params["project"]
  );

  let token = await innoslate.get_deeplynx_token(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_key"],
    req.params["dl_secret"]
  );

  let response = await innoslate.push_innoslate_requirements(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_container_id"],
    req.params["dl_datasource_id"],
    token,
    requirements
  );

  res.status(200).send([{'message':`Requirements pushed to Deep Lynx container ${req.params["dl_container_id"]}`, 'response': response}]);
});

app.get('/push_requirements/:inno_key/:inno_org/:inno_proj/:dl_key/:dl_secret/:dl_container_id', async function(req, res) {
  const innoslate = new Innoslate(env_vars.INNOSLATE_HOST!, req.params["inno_key"]);

  let token = await innoslate.get_deeplynx_token(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_key"],
    req.params["dl_secret"]
  );

  let requirements = await innoslate.get_deeplynx_requirements(
    `${env_vars.DEEP_LYNX_ADDRESS!}:${env_vars.DEEP_LYNX_PORT!}`,
    req.params["dl_container_id"],
    token
  );

  let adapted_requirements = await innoslate.adapt_requirements(
    requirements[0].data.nodes,
    req.params["inno_org"],
    req.params["inno_proj"]
  );

  let response = await innoslate.push_requirements(
    adapted_requirements,
    req.params["inno_org"],
    req.params["inno_proj"]
  );

  res.status(200).send([{'response':response}]);
});

app.listen(port, () => {
  console.log(`Innoslate adapter server running on port ${port}`);
});
