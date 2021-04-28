// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const Project = require('./models/Project');
const Document = require('./models/Document');
const Entity = require('./models/Entity');
const FlatDocument = require('./models/FlatDocument')
const FlatEntity = require('./models/FlatEntity')
const axios = require('axios');

class DocumentTransformer {

    constructor(host, key) {
        this.host = host,
        this.key = key,
        this.data = {
            projects: [],
            documents: [],
            flatEntities: [],
            // We can add more properties here!
        }
    }

    async extract(projId) {
        await this.getProject(projId);
        await this.getDocuments();
        await this.getEntities();

        return this.data;
    }

    async getProject(projId) {
    /*
        GET a project from the Innoslate API.
    */
        await axios.get(`${this.host}/o/nric/p/${projId}`,
        {
            headers: {'Authorization': `basic ${this.key}`}
        })
        .then(response => {
            try {
                this.data.projects.push(
                    new Project(
                        response.data.id,
                        response.data.name,
                        response.data.description
                    )
                );
            }
            catch (error) {
                console.log(error);
            }
        });
    }

    async getDocuments() {
    /*
        Generate an array of promises for a project's documents.
        Push the documents to the project's documents array.

        If there is only one document, the response.data object is not iterable and must be handled more verbosely.
    */
        let promises = this.data.projects.map(project => {
            return axios.get(`${this.host}/o/nric/entities`,
            {
                params: {
                    query: "order:modified- AND (labelid:23 OR labelid:22 OR labelid:25)",
                    projectId: project.id,
                    limit: 16,
                    offset: 0
                },
                headers: {
                    'Authorization': `basic ${this.key}`
                }
            });
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
                        this.data.documents.push(
                            // {
                            //     "id": String(document.id),
                            //     "name": document.name,
                            //     "description": document.description
                            // }
                            new FlatDocument(
                                document.id,
                                document.name,
                                document.number,
                                document.description
                            )
                        );
                        })
                    }
                catch (error) {
                    if (error instanceof TypeError) {
                        let id = response.data.id;
                        let name = response.data.name;
                        let number = response.data.number;
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
                        this.data.documents.push(
                            // {
                            //     "id": String(id),
                            //     "name": name,
                            //     "description": description
                            // }
                            new FlatDocument(
                                id,
                                name,
                                number,
                                description
                            )
                        );
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
                return axios.get(`${this.host}/o/nric/entities/${document.id}`,
                {
                    params: {levels: '25', includeRelations: 'source of,decomposed by'},
                    headers: {'Authorization': `basic ${this.key}`}
                })
            });
        })

        await Promise.all(promises.map(promise => {
            return Promise.all(promise);
        })).then(promises => {
            promises.forEach((responses, project) => {
                responses.forEach((response, document) => {
                    try {
                        //console.log(response.data)
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
                            this.data.documents[document].entities.push(
                                new FlatEntity (
                                    entity.id,
                                    entity.number,
                                    entity.sortNumber,
                                    entity.classId,
                                    entity.name,
                                    entity.description,
                                    entity.is_requirement,
                                    entity.rationale,
                                    entity.rels
                                )
                            )
                            this.data.flatEntities.push(
                                new FlatEntity (
                                    entity.id,
                                    entity.number,
                                    entity.sortNumber,
                                    entity.classId,
                                    entity.name,
                                    entity.description,
                                    entity.is_requirement,
                                    entity.rationale,
                                    entity.rels
                                )
                            )
                        })
                    }
                    catch (error) {
                        if (error instanceof TypeError) {
                            let id = response.data.id;
                            let number = response.data.number;
                            let sortNumber = response.data.sortNumber;
                            let class_id = response.data.classId;
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

                            this.data.documents[document].entities.push(
                                new FlatEntity (
                                    id,
                                    number,
                                    sortNumber,
                                    classId,
                                    name,
                                    description,
                                    is_requirement,
                                    rationale,
                                    rels
                                )
                            )

                            this.data.flatEntities.push(
                                new FlatEntity (
                                    id,
                                    number,
                                    sortNumber,
                                    class_id,
                                    name,
                                    description,
                                    is_requirement,
                                    rationale,
                                    rels
                                )
                            )
                        } else {
                            console.log(error);
                        }
                    }
                });
            });
        });
    }
}

module.exports = DocumentTransformer;
