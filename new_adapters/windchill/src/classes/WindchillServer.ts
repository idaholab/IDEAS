import axios from 'axios';

class WindchillServer {
  base_url: string;
  auth_header: string;

  constructor(base_url: string, auth_header: string) {
    this.base_url = base_url;
    this.auth_header = auth_header;
  }

  async get_health() {
    let response: any = await axios.get(
      `${this.base_url}/wtcore/test/dynAnon.jsp`
    ).then(response => {
      if (response.status == 200) {
        return [{"value": "OK"}]
      } else {
        return [{"value": "DEAD"}]
      }
    }).catch(error => {
      return [{"value": "DEAD"}]
    });

    return response;
  }

  async get_nonce() {
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v3/PTC/GetCSRFToken()`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response =>{
      return response.data;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_containers() {
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v5/DataAdmin/Containers?%24count=false`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response =>{
      return response.data.value;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_container(container_id: string) {
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v5/DataAdmin/Containers('${container_id}')`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response =>{
      return response.data;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_folders(container_id: string) {
    let settings: string = encodeURIComponent('$levels=max')
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v5/DataAdmin/Containers('${container_id}')/Folders?$expand=Folders(${settings})`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response => {
      return response.data.value;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_change_requests(folder_name: string) {
    let filter = ''
    if (folder_name != '') {
      filter = '&$filter=' + encodeURIComponent(`Folder/Name eq '${folder_name}'`)
    }
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v6/ChangeMgmt/ChangeRequests?$count=false${filter}`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response => {
      return response.data.value;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_affected_objects(change_request_id: string) {
    let response: any = await axios.get(
      `${this.base_url}/servlet/odata/v6/ChangeMgmt/ChangeRequests('${change_request_id}')/CRAffectLinks?$count=false&$expand=AffectedObjects`,
      { headers: { Authorization: `${this.auth_header}` } }
    ).then(response => {
      return response.data.value;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async post_body(odata_address:string, body: any, nonce: string) {

    let response: any = await axios.post(
      `${this.base_url}/servlet/odata/${odata_address}`,
      body,
      {
        headers: {
          'Authorization': `${this.auth_header}`,
          'CSRF_NONCE': nonce,
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      return response.data.value;
    }).catch(error => {
      return {
        "error": error.message
      }
    });

    return response;
  }

}

export { WindchillServer }
