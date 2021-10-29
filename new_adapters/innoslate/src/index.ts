import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authenticate from './scripts/authenticate';
import getRequirements from './scripts/requirements';
import entityFactory from './scripts/factory';

import { IProcessEnv } from './interfaces/IProcessEnv';

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.INNOSLATE_ADAPTER_PORT!);

const app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Innoslate requirements adapter" });
});

app.get('/health', function(req, res) {
  res.status(200).send({ 'value': "OK" });
});

app.get('/list_organizations', function(req, res) {
  res.status(200).send({ 'value': "NOT IMPLEMENTED" });
});

app.get('/push_requirements', async function(req, res) {
  let token: string = await authenticate();
  let requirements = await getRequirements(token);
  for (let requirement of requirements) {
    await entityFactory(requirement.properties);
  }
  res.status(200).send({ 'value': "NOT IMPLEMENTED" });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
