// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Document {
    constructor(
        id,
        name,
        description,
        created,
        modified,
        createdBy,
        modifiedBy,
        version
        ) {
            this.id = id,
            this.name = name,
            this.description = description,
            this.created = created,
            this.modified = modified,
            this.createdBy = createdBy,
            this.modifiedBy = modifiedBy,
            this.version = version,
            this.entities = []
        }
}

module.exports = Document;