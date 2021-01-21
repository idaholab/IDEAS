// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Entity {
    constructor(
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
    ) {
        this.id = id,
        this.number = number,
        this.sortNumber = sortNumber,
        this.name = name,
        this.description = description,
        this.created = created,
        this.modified = modified,
        this.createdBy = createdBy,
        this.modifiedBy = modifiedBy,
        this.is_requirement = is_requirement,
        this.rationale = rationale,
        this.rels = rels,
        this.version = version
    }
}

module.exports = Entity;