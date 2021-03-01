// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Geolocation {
    constructor(latitude, longitude) {
        this.latitude = parseFloat(latitude),
        this.longitude = parseFloat(longitude)
    }
}

module.exports = Geolocation;
