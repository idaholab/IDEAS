// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const path = require('path');

class InnoslateRequest {
  // This class defines methods and structures to launch and return requests
  //  through the axios library. The class is constructed with a base URL for
  //  fetching data, and a security header
  constructor(host, base_path, headers) {
    this.host = host
    this.base_path = base_path
    this.headers = headers
    this.address = ''
    this.data = {}
  }

  //return full address for request
  createAddress() {
    return this.host + path.join(
      this.base_path,
      this.address
    )
  }

  //return headers for http request
  createHeaders() {
    return {
      headers: this.headers
    }
  }

  // reduce list of objects to id, name, and description only
  abbreviate() {
    var temp_data = []
    for (var i=0; i < this.data.length; i++) {
      temp_data.push({
        'id': this.data[i]['id'],
        'name': this.data[i]['name'],
        'description': this.data[i]['description']
      })
    }
    this.data = temp_data
  }

  // set address, set headers, and retrieve data from address
  async retrieve_one(address, abbrev) {
    this.address = address
    var addr = this.createAddress()
    var headers = this.createHeaders()

    try {
      var response = await axios.get(addr, headers)
      this.data = await response.data
    } catch(error) {
      //console.error(`Could not retrieve: ${error}`)
      this.data = error
    }
    if (abbrev) {
      this.abbreviate()
    }
    return this.data
  }

  // set headers, launch requests for each address and retrieve data from
  //   multiple addresses
  async retrieve_multiple(addresses) {
    var headers = this.createHeaders()
    var keys = Object.keys(addresses)
    var temp_responses = []

    this.data = {}

    keys.forEach(key => {
      this.address = addresses[key]
      var response = axios.get(this.createAddress(this.address), headers)
      temp_responses.push(response)
    })

    // return dictionary of axios Promise objects
    this.data = temp_responses
    return {'keys': keys, 'data': this.data}
  }

}

module.exports = InnoslateRequest;