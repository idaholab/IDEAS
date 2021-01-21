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

    async get() {
        await this.getProjects();
        await this.getDocuments();
        await this.getEntities();

        return this.data;
        
    }

    async getProjects() {
    /*
        Extract projects from the Innoslate API. 
        If there is only one project, the response object is not iterable and must be handled more verbosely.
    */
        await axios.get(`${this.host}:${this.port}/o/nric/p/`).then(response => {
            
            try {
                for (let project of response.data) {
                    this.data.projects.push(new Project(
                        project.id,
                        project.name,
                        project.description
                    ))
                }
            } catch {                
                if (response.data.id) {
                    let id = response.data.id;
                    let name = response.data.name;
                    let description = response.data.description;
                    this.data.projects.push(new Project(
                        id,
                        name,
                        description
                    ))}
            }
        });
    }

    async getDocuments() {
    /*
        For each project in the data array, query its corresponding documents, and append them to that project's documents array.
        If there is only one document, the response object is not iterable and must be handled more verbosely.
    */
        for(let project of this.data.projects) {
                await axios.get(`${this.host}:${this.port}/o/nric/` + project.id + "/documents").then(response => {

                    try {
                        response.data.forEach(document => {

                            project.documents.push(new Document(
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
                    } catch {
                        let id = response.data.id;
                        let name = response.data.name;
                        let description = response.data.description;
                        let created = response.data.created;
                        let modified = response.data.modified;
                        let createdBy = response.data.createdBy;
                        let modifiedBy = response.data.modifiedBy;
                        let version = response.data.version;
                        
                        project.documents.push(new Document(
                            id,
                            name,
                            description,
                            created,
                            modified,
                            createdBy,
                            modifiedBy,
                            version
                        ));
                    }
                });
            }
        }

    async getEntities() {
    /*
        For each project in the data array, iterate through it's documents array. 
        For each document in the documents array, query its corresponding entities and append them to that document's entities array.
        
        If there is only one entity, the response object is not iterable and must be handled more verbosely.
    */

        for(let project of this.data.projects) {
            for(let document of project.documents) {
                await axios.get(`${this.host}:${this.port}/o/nric/report_data/` + document.id).then(response => {

                try {
                    response.data.forEach(entity => {
                        document.entities.push(new Entity (
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
                        ));
                    })
                } catch {
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


                    document.entities.push(new Entity(
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
                        )
                    );
                }
                }
            )};
        }
    }
}

module.exports = InnoslateAdapter;