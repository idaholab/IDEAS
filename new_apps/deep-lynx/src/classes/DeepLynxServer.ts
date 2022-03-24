// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

import axios from 'axios';
import { IFile } from '../interfaces/IFile'
import FormData from 'form-data';
import {Blob} from 'buffer';

export class DeepLynxServer {

    host: string;
    config: any;
    data: any;

    constructor(host: string, token: string="NONE") {
        this.host = host;
        this.config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            }
        };
        this.data = {};
    }

    async getHealth() {
        await axios.get(
            `${this.host}/health`
        ).then(response => {
            try {
                this.data = response.data;
            }
            catch (error) {
                this.data.error = error;
                console.log(error);
            }
        }).catch(error => {
            this.data.error = error;
            console.log(error)
        });
        return [this.data];
    }

    async getToken(apiKey: string, apiSecret: string, tokenExpiry: string) {
        await axios.get(`${this.host}/oauth/token`,
            {headers:{
                'x-api-key': apiKey,
                'x-api-secret': apiSecret,
                'x-api-expiry': tokenExpiry,
                'content-type': 'application/json'
            }}
        ).then(response => {
            try {
                this.data.token = response.data;
            }
            catch (error) {
                this.data.error = error;
                console.log(error);
            }
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async getContainers() {
        await axios.get(
          `${this.host}/containers?offset=0&limit=100`,
          this.config
        ).then(response => {
            this.data.containers = [];
            for(var i = 0; i < response.data.value.length; i++ ) {
              this.data.containers.push({
                  'name': response.data.value[i].name,
                  'description': response.data.value[i].description,
                  'id': response.data.value[i].id
              });
            }
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async getDatasources(container_id: string) {
        await axios.get(
          `${this.host}/containers/${container_id}/import/datasources`,
          this.config
        ).then(response => {
            this.data.datasources = [];
            for(var i = 0; i < response.data.value.length; i++ ) {
              this.data.datasources.push({
                  'name': response.data.value[i].name,
                  'type': response.data.value[i].adapter_type,
                  'id': response.data.value[i].id
              });
            }
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async getMetatypeDefinition(container_id: string, metatype_name: string) {
      await axios.get(
        `${this.host}/containers/${container_id}/metatypes?limit=1&offset=0&name=${metatype_name}`,
        this.config
      ).then(response => {
        this.data.metatype_definition = response.data.value[0]
      }).catch(error => {
        this.data.error = error;
      });

      return [this.data];
    }

    async getFiles(container_id: string) {
        let file_list: IFile = {};
        this.config.headers['content-type'] = 'text/plain'
        await axios.post(
          `${this.host}/containers/${container_id}/query`,
          '{ files {id, file_name, created_at}}',
          this.config
        ).then(response => {
            this.data.files = response.data.data.files;
            for(var i = 0; i < this.data.files.length; i++ ) {
              if (this.data.files[i].file_name in file_list) {
                  var fn: string = this.data.files[i].file_name;
                  file_list[fn].push({
                      "id": this.data.files[i].id,
                      "created_at": this.data.files[i].created_at
                  })
              } else {
                  file_list[this.data.files[i].file_name] = [{
                      "id": this.data.files[i].id,
                      "created_at": this.data.files[i].created_at
                  }]
              }
            }
            this.data.file_list = file_list;
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async getNodes(container_id: string, node_name: string) {
        this.config.headers['content-type'] = 'text/plain'
        await axios.post(
          `${this.host}/containers/${container_id}/query`,
          `{nodes (where: {AND: [{metatype_name: "like ${node_name}"}]}){id metatype{id name} properties{key value type}}}`,
          this.config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async query(container_id: string, query_body: any) {
      await axios.post(
        `${this.host}/containers/${container_id}/query`,
        query_body,
        this.config
      ).then(response => {
          this.data = response.data;
      }).catch(error => {
          this.data.error = error;
      });
      return [this.data];
    }

    async postObject(container_id: string, datasource_id: string, post_body: any) {
        await axios.post(
          `${this.host}/containers/${container_id}/import/datasources/${datasource_id}/imports`,
          post_body,
          this.config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async postFiles(container_id: string, datasource_id: string, post_files: any) {
        delete this.config.headers['content-type']
        this.config.headers['Content-Type'] = 'multipart/form-data'
        this.config.headers['Accept'] = 'application/json'

        let formData = new FormData()

        for (var i in post_files) {
          let { buffer, originalname, fieldname, mimetype, encoding, size } = post_files[i];
          console.log(originalname, fieldname, mimetype, encoding, size)
          formData.append(fieldname, buffer, {filename: originalname})
        }

        this.config.headers['Content-Type'] += `; boundary=${formData.getBoundary()}`

        await axios.post(
          `${this.host}/containers/${container_id}/import/datasources/${datasource_id}/files`,
          formData,
          this.config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
        });
        return [this.data];
    }

    async downloadFile(container_id: string, file_id: string, output_path: string) {
      console.log(output_path);
      await axios.get(
        `${this.host}/containers/${container_id}/files/${file_id}/download`,
        this.config
      ).then(response => {
        this.data = response.data;
      }).catch(error => {
        console.log(error);
        this.data.error = error;
      });
      return [this.data];
    }

}
