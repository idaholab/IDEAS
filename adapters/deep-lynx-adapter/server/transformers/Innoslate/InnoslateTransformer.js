// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const Project = require('./models/Project');
const DocumentTransformer = require('./DocumentTransformer');
const NonDocumentTransformer = require('./NonDocumentTransformer');
const axios = require('axios');

class InnoslateTransformer {

    constructor(host, key) {
        this.host = host,
        this.key = key
        this.data = {
            projects: []
        }
    }

    async extractNonDocument(projId) {
        let adapter = new NonDocumentTransformer(this.host, this.key);
        let data = await adapter.extract(projId);
        return data;
    }

    async extractDocument(projId) {
        let adapter = new DocumentTransformer(this.host, this.key);
        let data = await adapter.extract(projId);
        return data;
    }

    async getObjects() {
        /*
            Show available data in Innoslate.

            If there is only one project, the response.data object is not iterable and must be handled more verbosely.
        */
        await Promise.all([axios.get(`${this.host}/o/nric/p/`,
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

        return this.data;

    }

}

module.exports = InnoslateTransformer;
