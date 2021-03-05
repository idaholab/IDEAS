// Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');

class VaultTransformer {

    constructor(host, token="", user_id="0") {
        this.host = host,
        this.token = token,
        this.user_id = user_id,
        this.data = {
          'objects': []
        }
    }

    async makeAuthURL(username, password, vault) {
      let response = await axios.get(
        `${this.host}/soap/filestore/IdentificationService/GetServerIdentities/NONE/NONE`
      );
      let dataserver = response.data.RESULT.GetServerIdentitiesResult.attributes.DataServer;
      let url = `${this.host}/soap/filestore/AuthService/SignIn/NONE/NONE?dataServer=${dataserver}&userName=${username}&userPassword=${password}&knowledgeVault=${vault}`;
      return url;
    }

    async getTokenAndUser(auth_url) {
      let response = await axios.get(auth_url);
      let token = response.data.TICKET;
      let user_id = response.data.USER_ID;
      return {token, user_id};
    }


}

module.exports = VaultTransformer;
