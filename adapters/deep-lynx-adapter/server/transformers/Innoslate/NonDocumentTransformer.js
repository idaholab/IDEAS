// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const Entity = require('./models/Entity');
const Schema = require('./models/Schema');
const axios = require('axios');

class NonDocumentTransformer {

    constructor(host, key) {
        this.host = host,
        this.key = key,
        this.schema = new Map(),
        this.data = {}
    }

    async extract(projId) {
        await this.extractSchema(projId);
        await this.extractEntities(projId);
        return this.data;
    }

    async extractSchema(projId) {
        await axios.get(`${this.host}/o/nric/p/${projId}/schema`, {
            headers: {'Authorization': `basic ${this.key}`}
        }).then(response => {
            response.data.classes.forEach(cls => {
                this.schema.set( cls.id, new Schema (
                    cls.id,
                    cls.name
                    )
                );
            });
        });
    }

    async extractEntities(projId) {
        await axios.get(`${this.host}/o/nric/entities`, {
            params: {'query': 'order:modified-', 'projectId': projId}, 
            headers: {'Authorization': `basic ${this.key}`}
        }).then(response => {
            response.data.forEach(entity => {
                    let schema = this.schema.get(entity.classId);
                    schema.entities.push(
                        new Entity (
                            entity.id,
                            entity.number,
                            entity.sortNumber,
                            entity.classId,
                            entity.name,
                            entity.description,
                            entity.created,
                            entity.modified,
                            entity.createdBy,
                            entity.modifiedBy,
                            entity.is_requirement,
                            entity.rationale,
                            entity.rels,
                            entity.version
                        )
                    )
                    this.data[`${schema.name}`] = schema.entities;
                });
            });
    }
}

module.exports = NonDocumentTransformer;