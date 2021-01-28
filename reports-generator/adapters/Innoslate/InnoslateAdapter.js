// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const Project = require('./models/Project');
const Document = require('./models/Document');
const Entity = require('./models/Entity');
const axios = require('axios');

class InnoslateAdapter {

    constructor(host, port) {
        this.host = host,
        this.port = port,
        this.data = {
            projects: []
            // We can add more properties here!
        }
    }

    async get(projId) {
        await this.getProject(projId);

        await this.getDocuments();

        await this.getEntities();

        return this.data;
    }

    async getProject(projId) {
    /*
        Extract projects from the Innoslate API. 

        If there is only one project, the response.data object is not iterable and must be handled more verbosely.
    */
        
        await Promise.all([axios.get(`${this.host}:${this.port}/o/nric/p/${projId}`)]).then(responses => {
            responses.forEach(response => {
                try {
                    response.data.forEach(project => {
                        this.data.projects.push(
                            new Project(
                                project.id,
                                project.name,
                                project.description
                            )
                        )
                    });
                } 
                catch (error) {
                    if (error instanceof TypeError) {
                        let id = response.data.id;
                        let name = response.data.name;
                        let description = response.data.description;
                        this.data.projects.push(new Project(
                            id,
                            name,
                            description
                        ));
                    }
                    else {
                        console.log(error);
                    }
                }
            });
        });
    }

    async getDocuments() {
    /*
        For all projects in the data array, generate an array of promises for its documents.
        For each project's documents in the response, push the document to that project's documents array.

        If there is only one document, the response.data object is not iterable and must be handled more verbosely.
    */
        let promises = this.data.projects.map(project => {
            return axios.get(`${this.host}:${this.port}/o/nric/` + project.id + "/documents")
        });

        await Promise.all(promises).then(responses => {
            responses.forEach((response, project) => {
                try {
                    response.data.forEach(document => {
                        this.data.projects[project].documents.push(
                            new Document(
                                document.id,
                                document.name,
                                document.description,
                                document.created,
                                document.modified,
                                document.createdBy,
                                document.modifiedBy,
                                document.version
                            ));
                        })
                    } 
                catch (error) {
                    if (error instanceof TypeError) {
                        let id = response.data.id;
                        let name = response.data.name;
                        let description = response.data.description;
                        let created = response.data.created;
                        let modified = response.data.modified;
                        let createdBy = response.data.createdBy;
                        let modifiedBy = response.data.modifiedBy;
                        let version = response.data.version;

                        this.data.projects[project].documents.push(
                            new Document(
                                id,
                                name,
                                description,
                                created,
                                modified,
                                createdBy,
                                modifiedBy,
                                version
                            ));
                    } else {
                        console.log(error);
                    }
                }
            })
        });
    }

    async getEntities() {
    /*
        For all projects in the data array, generate a nested array of promises for each of its document's entities.
        For each nested array, return a single promise.
        When the nested promises resolve, push the results to each project's document's entities array. 
        
        If there is only one entity, the response.data object is not iterable and must be handled more verbosely.
    */

        let promises = []

        this.data.projects.forEach((project, document) => {
            promises[document] = project.documents.map(document => {
                return axios.get(`${this.host}:${this.port}/o/nric/report_data/` + document.id)
            });
        })

        await Promise.all(promises.map(promise => {
            return Promise.all(promise);
        })).then(promises => {
            promises.forEach((responses, project) => {
                responses.forEach((response, document) => {
                    try {
                        response.data.forEach(entity => {
                            this.data.projects[project].documents[document].entities.push(
                                new Entity (
                                    entity.id,
                                    entity.number,
                                    entity.sortNumber,
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
                            );
                        })
                    } 
                    catch (error) {
                        if (error instanceof TypeError) {
                            let id = response.data.id;
                            let number = response.data.number;
                            let sortNumber = response.data.sortNumber;
                            let name = response.data.name;
                            let description = response.data.description;
                            let created = response.data.created;
                            let modified = response.data.modified;
                            let createdBy = response.data.createdBy;
                            let modifiedBy = response.data.modifiedBy;
                            let is_requirement = response.data.is_requirement;
                            let rationale = response.data.rationale;
                            let rels = response.data.rels;
                            let version = response.data.version;
        
        
                            this.data.projects[project].documents[document].entities.push(
                                new Entity(
                                    id,
                                    number,
                                    sortNumber,
                                    name,
                                    description,
                                    created,
                                    modified,
                                    createdBy,
                                    modifiedBy,
                                    is_requirement,
                                    rationale,
                                    rels,
                                    version
                                ));
                        } else {
                            console.log(error);
                        }
                    } 
                });
            });
        });
    }
}

module.exports = InnoslateAdapter;