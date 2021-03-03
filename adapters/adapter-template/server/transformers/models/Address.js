// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Address {
    constructor(street, suite, city, zipcode, geolocation) {
        this.street = street,
        this.suite = suite,
        this.city = city,
        this.zipcode = zipcode,
        this.geolocation = geolocation
    }
}

module.exports = Address;
