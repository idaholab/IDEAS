// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const User = require('./models/User');
const Address = require('./models/Address');
const Geolocation = require('./models/Geolocation');
const Company = require('./models/Company');
const axios = require('axios');

class DeepLynxTransformer {

    constructor(host, token="NONE") {
        this.host = host,
        this.config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        this.data = {}
    }

    async getHealth() {
        await axios.get(`${this.host}/health`).then(response => {
            try {
                this.data = response.data;
            }
            catch (error) {
                console.log(error);
            }
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
                })
            })
            //this.data.containers = response.data.value;
        }).catch(error => {
            this.data.error = error;
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
        });
        return this.data;
    }

}

module.exports = DeepLynxTransformer;
