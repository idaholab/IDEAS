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
      await db.Asset.create({
        name: name,
        deepLynxID: dlID
      }).then(asset => {
        this.data["asset"] = asset;
        this.data["is_error"] = false;
        this.data["message"] = `${asset.name} successfully added`
      }).catch(error => {
        this.data["asset"] = null;
        this.data["is_error"] = true;
        this.data["message"] = `${name} NOT added`
      });

      return this.data;
    }

    async addFile(name, dlID) {
      await db.sequelize.sync();
      await db.File.create({
        name: name,
        deepLynxID: dlID
      }).then(file => {
        this.data["file"] = file;
        this.data["is_error"] = false;
        this.data["message"] = `${file.name} successfully added`
      }).catch(error => {
        this.data["file"] = null;
        this.data["is_error"] = true;
        this.data["message"] = `${name} NOT added`
      });

      return this.data;
    }

    async addTrace(name, assetId, fileId) {
      await db.sequelize.sync();
      await db.Trace.create({
        name: name,
        assetId: assetId,
        fileId: fileId
      }).then(trace => {
        this.data["trace"] = trace;
        this.data["is_error"] = false;
        this.data["message"] = `${trace.name} successfully added`
      }).catch(error => {
        this.data["trace"] = null;
        this.data["is_error"] = true;
        this.data["message"] = `${name} NOT added`
      });

      return this.data;
    }

}

module.exports = AppDatabaseTransformer;
