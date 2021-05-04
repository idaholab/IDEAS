// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const db = require('../../database/models/index.js')

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

    async getAssets() {
        let assets = await db.Asset.findAll();
        this.data["assets"] = assets;

        return this.data;
    }

    async getFiles() {
        let files = await db.File.findAll();
        this.data["files"] = files;

        return this.data;
    }

    async getTraces() {
      let traces = await db.Trace.findAll();
      this.data["traces"] = traces;

      return this.data;
    }

    async addAsset(name, dlID) {
      await db.sequelize.sync();
      const new_asset = await db.Asset.create({
        name: name,
        deepLynxID: dlID
      });
      console.log(new_asset.toJSON());
    }

}

module.exports = AppDatabaseTransformer;
