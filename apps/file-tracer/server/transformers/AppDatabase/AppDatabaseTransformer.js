// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const db = require('../../models/index.js')

class AppDatabaseTransformer {

    constructor() {
        this.data = {}
    }

    async connectionIsOpen() {
        let connection = false;
        try {
            await db.sequelize.authenticate();
            connection = true;
        } catch (error) {
            console.log("DB NOT AUTHENTICATED: " + error);
        }
        return connection;
    }

}

module.exports = AppDatabaseTransformer;
