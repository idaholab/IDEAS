// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Project {
    constructor(id, name, description) {
        this.id = id,
        this.name = name,
        this.description = description,
        this.documents = []
    }
}

module.exports = Project;