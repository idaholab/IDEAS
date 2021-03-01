// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class User {
    constructor(id, name, username, email, address, phone, website, company) {
        this.id = String(id),
        this.name = name,
        this.username = username,
        this.email = email,
        this.address = address,
        this.phone = phone,
        this.website = website,
        this.company = company
    }
}

module.exports = User;
