// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const FormData = require('form-data');

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
            console.log(error);
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
            console.log(error);
        });
        return this.data;
    }

    async getContainers() {
        await axios.get(
          `${this.host}/containers?offset=0&limit=100`,
          this.config
        ).then(response => {
            this.data.containers = [];
            console.log(response.data)
            response.data.value.forEach(container => {
                this.data.containers.push({
                    'name': container.name,
                    'description': container.description,
                    'id': container.id
                });
            });
        }).catch(error => {
            this.data.error = error;
            console.log(error);
        });
        return this.data;
    }

    async getDatasources(container_id) {
        await axios.get(
            `${this.host}/containers/${container_id}/import/datasources`,
            this.config
        ).then(response => {
            this.data.datasources = [];
            response.data.value.forEach(datasource => {
                this.data.datasources.push({
                    'name': datasource.name,
                    'id': datasource.id,
                    'type': datasource.type,
                    'config': datasource.config
                });
            });
        }).catch(error => {
            this.data.error = error;
            console.log(error);
        });
        return this.data;
    }

    async postManualImport(container_id, datasource_id, import_data) {
        await axios.post(
            `${this.host}/containers/${container_id}/import/datasources/${datasource_id}/imports`,
            import_data,
            this.config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
            console.log(error);
        });
        return this.data;
    }

    async postFileImport(container_id, datasource_id, import_data) {
        let metadata = import_data[0].metadata;
        let base64file = import_data[0].file;
        let file = await Buffer.from(base64file, "base64");

        let form_data = new FormData();
        form_data.append("file", file, {filename: metadata.Name});

        let temp_config = {};
        temp_config.headers = {};
        temp_config.headers["Authorization"] = this.config.headers["Authorization"];
        temp_config.headers["Content-Type"] = 'multipart/form-data;boundary=' + form_data["_boundary"];

        await axios.post(
            `${this.host}/containers/${container_id}/import/datasources/${datasource_id}/files`,
            form_data,
            temp_config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
            console.log(error);
        });
        return this.data;
    }

    async postMetadataImport(container_id, datasource_id, import_data, file_import_receipt) {
        let metadata = import_data[0].metadata;
        await axios.post(
            `${this.host}/containers/${container_id}/import/datasources/${datasource_id}/imports`,
            [{'metadata': metadata, 'file_import_receipt': file_import_receipt}],
            this.config
        ).then(response => {
            this.data = response.data;
        }).catch(error => {
            this.data.error = error;
            console.log(error);
        });
        return this.data;
    }

}

module.exports = DeepLynxTransformer;
