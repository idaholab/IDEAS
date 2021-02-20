// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const User = require('./models/User');
const Address = require('./models/Address');
const Geolocation = require('./models/Geolocation');
const Company = require('./models/Company');
const axios = require('axios');

class DeepLynxTransformer {

    constructor(host, token="NONE") {
        this.host = host,
        this.token = token
        this.data = {}
    }

    async getHealth() {
        await axios.get(`${this.host}/health`
        ).then(response => {
            try {
              this.data = response.data
            }
            catch (error) {
                console.log(error);
            }
        });

        return this.data;
    }

    async getToken(apiKey, apiSecret, tokenExpiry) {
        await axios.get(`${this.host}/oauth/token`,
            {headers:
                {
                  'x-api-key': apiKey,
                  'x-api-secret': apiSecret,
                  'x-api-expiry': tokenExpiry
                }
            }
        ).then(response => {
            try {
              this.data.token = response.data
            }
            catch (error) {
                console.log(error);
            }
        });

        return this.data;

    }

}

module.exports = DeepLynxTransformer;
