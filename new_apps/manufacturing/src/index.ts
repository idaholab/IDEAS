import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { IProcessEnv } from './interfaces/IProcessEnv';

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.MANUFACTURING_PORT!);

const app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.status(200).send([{ 'message': "This is the Manufacturing App backend service" }]);
});

app.get('/health', function(req, res) {
  res.status(200).send([{ 'value': "OK" }]);
});

app.listen(port, () => {
  console.log(`Manufacturing server running on port ${port}`);
});
