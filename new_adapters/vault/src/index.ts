import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { IProcessEnv } from './interfaces/IProcessEnv';
import { VaultVars } from './types/VaultVars';
import { VaultServer } from './classes/VaultServer'

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.VAULT_ADAPTER_PORT!);

const vault_vars: VaultVars = [
  env_vars.VAULT_API_ADDRESS!,
  env_vars.VAULT_SERVER_USERNAME!,
  env_vars.VAULT_SERVER_PASSWORD!
];

const app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.status(200).send([{ 'message': "This is the Vault data adapter" }]);
});

app.get('/health', function(req, res) {
  res.status(200).send([{ 'value': "OK" }]);
});

app.get('/:vault/authenticate', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    res.status(200).send(
      authentication
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/root', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var root = await vault_server.get_folder_root();
    res.status(200).send(
      root
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/folder/:folder_id/child_folders', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var folders = await vault_server.get_child_folders(req.params['folder_id']);
    res.status(200).send(
      folders
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/add_folder/:name/:parent_id', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var creation_response = await vault_server.add_folder(
      req.params['name'],
      req.params['parent_id']
    );
    res.status(200).send(
      creation_response
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/get_co_items/:change_order_id', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var items = await vault_server.get_co_items(
      req.params['change_order_id']
    );
    res.status(200).send(
      items
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/folder/:folder_id/files', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var files = await vault_server.get_latest_files(req.params['folder_id']);
    res.status(200).send(
      files
    );
  } else {
    res.status(401).send(
      { "message": authentication.message }
    );
  }

  return;

});

app.get('/:vault/get_file/:file_id', async function(req, res) {
  const vault_server = new VaultServer(...vault_vars, req.params['vault']);

  var authentication = await vault_server.authenticate(req.headers.authorization);

  if (authentication.success) {
    var metadata = await vault_server.get_file_metadata(req.params['file_id']);
    var file_name = metadata.attributes.Name;
    var file_obj = await vault_server.get_file(req.params['file_id'], file_name);

    if (file_obj.success) {
      res.status(200).send([{
        metadata: metadata,
        file_obj: file_obj.data
      }]);
    } else {
      res.status(500).send(
        [{ "message": "File not sent." }]
      );
    }
  } else {
    res.status(401).send(
      [{ "message": authentication.message }]
    );
  }

  return;

});

app.listen(port, () => {
  console.log(`Vault adapter backend server running on port ${port}`);
});
