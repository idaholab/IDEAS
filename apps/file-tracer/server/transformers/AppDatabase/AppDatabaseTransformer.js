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

      this.data["asset_added"] = new_asset.toJSON();

      return this.data;
    }

    async addFile(name, dlID) {
      await db.sequelize.sync();
      const new_file = await db.File.create({
        name: name,
        deepLynxID: dlID
      });

      this.data["file_added"] = new_file.toJSON();

      return this.data;
    }

    async addTrace(name, assetId, fileId) {
      await db.sequelize.sync();
      const new_trace = await db.Trace.create({
        name: name,
        assetId: assetId,
        fileId: fileId
      });

      this.data["trace_added"] = new_trace.toJSON();

      return this.data;
    }

}

module.exports = AppDatabaseTransformer;
