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
        this.id = String(id),
        this.number = number,
        this.sortNumber = sortNumber,
        this.name = name,
        this.description = description,
        this.created = String(created),
        this.modified = String(modified),
        this.createdBy = createdBy,
        this.modifiedBy = modifiedBy,
        this.is_requirement = is_requirement,
        this.rationale = rationale,
        this.rels = rels,
        this.version = String(version)
    }
}

module.exports = Entity;
