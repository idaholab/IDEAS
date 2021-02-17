// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const Project = require('./models/Project');
const Entity = require('./models/Entity');
const Organization = require('./models/Organization');
const axios = require('axios');

class NonDocumentAdapter {

    constructor(host, key) {
        this.host = host,
        this.key = key,
        this.data = {
            projects: [],
            organizations: []
            // We can add more properties here!
        }
    }

    async extract(projId) {
        await this.getProject(projId);
        await this.extractEntities(projId);
        await this.getOrganizations();

        return this.data;
    }

    async getProject(projId) {
    /*
        Extract projects from the Innoslate API. 

        If there is only one project, the response.data object is not iterable and must be handled more verbosely.
    */
        await Promise.all([axios.get(`${this.host}/o/nric/p/${projId}`, 
        {
            headers: {'Authorization': `basic ${this.key}`}
        })
        ]).then(responses => {
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

    async getOrganizations() {
        await Promise.all([axios.get(`${this.host}/o`, {
            headers: {
                'Authorization': `basic ${this.key}`
            }
        })]).then(responses => {
            responses.forEach(response => {
                try {
                    response.data.forEach(organization => {
                        this.data.organizations.push(
                            new Organization(
                                organization.slug,
                                organization.name,
                                organization.description,
                                organization.created,
                                organization.modified,
                                organization.createdBy,
                                organization.modifiedBy,
                                organization.version
                            )
                        )
                    })
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        console.log(response.data);
                        this.data.organizations.push(
                            new Organization(
                                response.data.slug,
                                response.data.name,
                                response.data.description,
                                response.data.created,
                                response.data.modified,
                                response.data.createdBy,
                                response.data.modifiedBy,
                                response.data.version
                            )
                        )
                    }
                    else {
                        console.log(error)
                    }
                }
            });
        });

        return this.data;
    }

    async extractEntities(projId) {
        await Promise.all([axios.get(`${this.host}/o/nric/entities`, {
            params: {'query': 'order:modified-', 'projectId': projId}, 
            headers: {'Authorization': `basic ${this.key}`}
        })]).then(responses => {
            responses.forEach((response, project) => {
                response.data.forEach(entity => {
                    this.data.projects[project].entities.push(
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
                    );
                });
            });
        });
    }
}

module.exports = NonDocumentAdapter;