// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');

class DeepLynxTransformer {

    constructor(host, token="NONE") {
        this.host = host,
        this.config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        },
        this.data = {}
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
        return this.data;
    }

    async getToken(apiKey, apiSecret, tokenExpiry) {
        await axios.get(`${this.host}/oauth/token`,
            {headers:{
                'x-api-key': apiKey,
                'x-api-secret': apiSecret,
                'x-api-expiry': tokenExpiry
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
        return this.data;
    }

    async getContainers() {
        await axios.get(
          `${this.host}/containers?offset=0&limit=100`,
          this.config
        ).then(response => {
            this.data.containers = [];
            response.data.value.forEach(container => {
                this.data.containers.push({
                    'name': container.name,
                    'description': container.description,
                    'id': container.id
                });
            });
        }).catch(error => {
            this.data.error = error;
        });
        return this.data;
    }

    async getFiles(container_id) {
        let file_list = {};
        this.config.headers['content-type'] = 'text/plain'
        await axios.post(
          `${this.host}/containers/${container_id}/query`,
          '{ files {id, file_name, created_at}}',
          this.config
        ).then(response => {
            this.data.files = response.data.data.files;
            this.data.files.forEach(f => {
                if (f.file_name in file_list) {
                    file_list[f.file_name].push({
                        "id": f.id,
                        "created_at": f.created_at
                    })
                } else {
                    file_list[f.file_name] = [{
                        "id": f.id,
                        "created_at": f.created_at
                    }]
                }
            });
            this.data.file_list = file_list;
        }).catch(error => {
            this.data.error = error;
        });
        return this.data;
    }

    async getNodes(container_id, node_name) {
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
        return this.data;
    }

}

module.exports = DeepLynxTransformer;
