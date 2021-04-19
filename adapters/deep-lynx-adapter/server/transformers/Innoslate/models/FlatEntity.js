// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class FlatEntity {
    constructor(
        project_id,
        project_name,
        project_description,
        document_id,
        document_name,
        document_description,
        entity_id,
        number,
        sortNumber,
        classId,
        name,
        description,
        is_requirement,
        rationale,
        rels
    ) {
        this.project_id = String(project_id),
        this.project_name = project_name,
        this.project_description = project_description,
        this.document_id = String(document_id),
        this.document_name = document_name,
        this.document_description = document_description,
        this.entity_id = String(entity_id),
        this.number = number,
        this.sortNumber = sortNumber,
        this.classId = String(classId),
        this.name = name,
        this.description = description,
        this.is_requirement = is_requirement,
        this.rationale = rationale,
        this.rels = rels
    }
}

module.exports = FlatEntity;
