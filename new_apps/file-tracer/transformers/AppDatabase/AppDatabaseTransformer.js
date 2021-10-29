// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const db = require('../../database/models/index.js')
const Op = db.Sequelize.Op;

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

    upsert(model, values, condition) {
      return model
        .findOne({ where: condition })
        .then( obj => {
          if (obj) {
            return obj.update(values);
          } else {
            return model.create(values);
          }
        });
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

    async getFileElements() {
        let file_elements = await db.FileElement.findAll();
        this.data["file_elements"] = file_elements;

        return this.data;
    }

    async getTraces() {
      let traces = await db.Trace.findAll();
      this.data["traces"] = traces;

      return this.data;
    }

    async getElementTraces() {
      let element_traces = await db.ElementTrace.findAll();
      this.data["element_traces"] = element_traces;

      return this.data;
    }

    async getAssetElements(asset_id, file_id) {
      this.data["asset_elements"] = [];
      let asset = await db.Asset.findOne({ where: {deepLynxID: asset_id}});
      let file_elements = await db.FileElement.findAll(
        { where: {fileDeepLynxID: file_id}}
      );

      let file_element_ids = [];
      let element_traces = [];

      if (file_elements.length > 0 && asset) {
        file_elements.forEach((file_element) => {
          file_element_ids.push(file_element.id);
        });

        element_traces = await db.ElementTrace.findAll(
          {
            attributes: ['fileElementId'],
            where: {assetId: asset.id, fileElementId: {[Op.in]: file_element_ids}}
          }
        );
        if (element_traces.length > 0) {
          let traces = [];
          element_traces.forEach((trace) => {
            traces.push(trace.fileElementId)
          });
          this.data["asset_elements"] = await db.FileElement.findAll(
            { where: {id: {[Op.in]: traces}}}
          );
        }
      }

      return this.data;
    }

    async addAsset(dlID) {
      await db.sequelize.sync();
      let asset = await this.upsert(
        db.Asset, {deepLynxID: dlID}, {deepLynxID: dlID}
      );
      this.data.asset = asset

      return this.data;
    }

    async addFile(dlID) {
      await db.sequelize.sync();
      let file = await this.upsert(
        db.File, {deepLynxID: dlID}, {deepLynxID: dlID}
      );
      this.data.file = file;

      return this.data;
    }

    async addFileElement(dlID, idx) {

      await db.sequelize.sync();
      let file_element = await this.upsert(
        db.FileElement,
        {fileDeepLynxID: dlID, elementIndex: idx},
        {fileDeepLynxID: dlID, elementIndex: idx}
      );
      this.data.file_element = file_element;

      return this.data;
    }

    async addTrace(assetId, fileId) {
      await db.sequelize.sync();
      let trace = await this.upsert(
        db.Trace,
        {assetId: assetId, fileId: fileId},
        {assetId: assetId, fileId: fileId}
      );
      this.data.trace = trace;

      return this.data;
    }

    async addElementTrace(assetId, fileElementId) {

      await db.sequelize.sync();
      let element_trace = await this.upsert(
        db.ElementTrace,
        {assetId: assetId, fileElementId: fileElementId},
        {assetId: assetId, fileElementId: fileElementId}
      );
      this.data.element_trace = element_trace

      return this.data;
    }

}

module.exports = AppDatabaseTransformer;
