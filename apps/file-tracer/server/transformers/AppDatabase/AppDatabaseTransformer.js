// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const { Client } = require('pg');
const pgClient = new Client({
    
});

class AppDatabaseTransformer {

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

}

module.exports = AppDatabaseTransformer;
