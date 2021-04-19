// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class FlatPayload {
    constructor(
        project_id,
        project_name,
        project_description,
        document_id,
        document_name,
        document_description,
        ) {
            this.project_id = String(project_id),
            this.project_name = project_name,
            this.project_description = project_description,
            this.document_id = String(document_id),
            this.document_name = document_name,
            this.document_description = document_description,
            this.entities = []
        }
}

module.exports = FlatPayload;
