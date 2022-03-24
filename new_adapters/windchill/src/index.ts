import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { IProcessEnv } from './interfaces/IProcessEnv';
import { CustomRequest } from './interfaces/CustomRequest'
import { WindchillServer } from './classes/WindchillServer';
import { simplified_object_array, simplified_recursive_object_array } from './scripts/windchill_utilities'

dotenv.config();

let env_vars: IProcessEnv = process.env;
const port: number = parseInt(env_vars.WINDCHILL_ADAPTER_PORT!);
const host: string = env_vars.WINDCHILL_HOST!

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Windchill requirements adapter" });
});

app.get('/health', async function(req, res) {
  try {
    const windchill = new WindchillServer(host, "NONE")
    let health_check = await windchill.get_health();
    res.status(200).send(health_check);
  } catch {
    res.status(500).send({
      'message': "Health endpoint inaccessible"
    });
  }
});

app.get('/hostname', async function(req, res) {
  res.status(200).send(host)
});

app.get('/get_nonce', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let nonce = await windchill.get_nonce()
    res.status(200).send(nonce);
  } catch {
    res.status(500).send({
      'message': "request to /get_nonce failed"
    });
  }
});

app.get('/containers', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let containers = await windchill.get_containers();
    let reduced_containers = simplified_object_array(
      containers,
      ["ID", "Name"]
    )
    res.status(200).send(reduced_containers);
  } catch {
    res.status(500).send({
      'message': "request to /containers failed"
    });
  }

});

app.get('/containers/:container_id', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let enc_id = encodeURIComponent(req.params["container_id"])
    let container = await windchill.get_container(enc_id);
    res.status(200).send(container);
  } catch {
    res.status(500).send({
      'message': "request to /containers/:container_id failed"
    });
  }
});

app.get('/folders/:container_id', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let enc_id = encodeURIComponent(req.params["container_id"])
    let folders = await windchill.get_folders(enc_id);
    let reduced_folders = simplified_recursive_object_array(
      folders,
      ["ID", "Name", "Location", "Description"],
      "Folders"
    )
    res.status(200).send(reduced_folders);
  } catch {
    res.status(500).send({
      'message': "request to /folders/:container_id failed"
    });
  }
});

app.get('/affect_links/:change_request_id', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let enc_id = encodeURIComponent(req.params["change_request_id"])
    let affect_links = await windchill.get_affected_objects(enc_id);

    res.status(200).send(affect_links);
  } catch {
    res.status(500).send({
      'message': "request to /affected_objects/:change_request_id failed"
    });
  }
});

app.post('/change_requests', async function(req, res) {
  try {
    const header: any = req.headers.authorization
    const windchill = new WindchillServer(host, header)
    let folder_name = ''
    if ("folder_name" in req.body) {
      folder_name = req.body["folder_name"]
    }
    let change_requests = await windchill.get_change_requests(folder_name);
    res.status(200).send(change_requests);
  } catch {
    res.status(500).send({
      'message': "request to /change_requests failed"
    });
  }
});

app.post('/create_documents', async function(req: CustomRequest, res) {
  try {
    const header: any = req.headers.authorization
    const nonce: string = req.headers.csrfnonce!
    const windchill = new WindchillServer(host, header)
    let create_response = await windchill.post_body(
      'v5/DocMgmt/CreateDocuments?$count=false',
      req.body,
      nonce
    )
    if ("error" in create_response) {
      res.status(500).send(create_response);
    } else {
      res.status(200).send(create_response);
    }
  } catch {
    res.status(500).send({
      'message': "request to /create_documents failed"
    });
  }
});

app.listen(port, () => {
  console.log(`Windchill adapter server running on port ${port}`);
});
