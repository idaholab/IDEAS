// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class FlatEntity {
    constructor(
        id,
        number,
        sortNumber,
        class_id,
        name,
        description,
        is_requirement,
        rationale,
        rels
    ) {
        this.id = String(id),
        //this.number = number,
        //this.sortNumber = sortNumber,
        //this.class_id = String(class_id),
        this.name = name,
        this.description = description
        //this.is_requirement = is_requirement,
        //this.rationale = rationale,
        //this.rels = rels
    }
}

module.exports = FlatEntity;
