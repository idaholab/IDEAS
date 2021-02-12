// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Project {
    constructor(id, name, description) {
        this.id = String(id),
        this.name = name,
        this.description = description,
        this.entities = []
    }
}

module.exports = Project;
