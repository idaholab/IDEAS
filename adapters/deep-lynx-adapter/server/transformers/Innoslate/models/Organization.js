// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Organization {
    constructor(
        slug,
        name,
        description,
        created,
        modified,
        createdBy,
        modifiedBy,
        version
        ) {
            this.slug = slug,
            this.name = name,
            this.description = description,
            this.created = created,
            this.modified = modified,
            this.createdBy = createdBy,
            this.modifiedBy = modifiedBy,
            this.version = version
    }
}

module.exports = Organization;