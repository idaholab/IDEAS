import axios from 'axios';
import IRequirement from '../interfaces/IRequirementEntity';
import type {Requirement} from '../types/Requirement';

class Innoslate {
  base_url: string;
  token: string;

  constructor(base_url: string, token: string) {
    this.base_url = base_url;
    this.token = token;
  }

  async get_organizations() {
    let response: any = await axios.get(
      `${this.base_url}/o/`,
      { headers: { Authorization: `basic ${this.token}` } }
    ).then(response =>{
      let filtered_response = [];
      for (let i = 0; i < response.data.length; i++) {
        filtered_response.push({
          name: response.data[i].name,
          slug: response.data[i].slug
        });
      }
      return filtered_response;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_projects(organization_name: string) {
    let response: any = await axios.get(
      `${this.base_url}/o/${organization_name}/p`,
      { headers: { Authorization: `basic ${this.token}` } }
    ).then(response =>{
      let filtered_response = [];
      for (let i = 0; i < response.data.length; i++) {
        filtered_response.push({
          name: response.data[i].name,
          id: response.data[i].id
        });
      }
      return filtered_response;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_deeplynx_token(deep_lynx_base: string, key: string, secret: string) {
    let response: any = await axios.get(
      `${deep_lynx_base}/get_token/${key}/${secret}`
    ).then(response => {
      return response.data[0].token
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_deeplynx_requirements(deep_lynx_base: string, container_id: string, token: string) {
    let response: any = await axios.get(
      `${deep_lynx_base}/get_requirements/${container_id}/${token}`
    ).then(response => {
      return response.data
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async get_innoslate_requirements(org_slug: string, project_id: string) {
    let response: any = await axios.get(
      `${this.base_url}/o/${org_slug}/entities?query=class:"Requirement"&projectId=${project_id}`,
      { headers: { Authorization: `basic ${this.token}` } }
    ).then(response =>{
      let filtered_response = [];
      for (let i = 0; i < response.data.length; i++) {
        filtered_response.push({
          id: response.data[i].id,
          description: response.data[i].description
        });
      }
      return filtered_response;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async push_innoslate_requirements(deep_lynx_base: string, container_id: string, datasource_id: string, token: string, requirements: any) {
    console.log(`${deep_lynx_base}/post_object/${container_id}/${datasource_id}/${token}`)
    let response: any = await axios.post(
      `${deep_lynx_base}/post_object/${container_id}/${datasource_id}/${token}`,
      [{"Requirements": requirements}]
    ).then(response => {
      return response.data
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

  async adapt_requirements(requirements_list: any, org_slug: string, project_id: string) {
    let adapted_reqs = [];

    // Allocate IDs
    let ids: any = await axios.get(
      `${this.base_url}/o/${org_slug}/allocate_ids`,
      { params: {
          type: 'entity',
          count: requirements_list.length },
        headers: {
          Authorization: `basic ${this.token}`
        }
      }
    ).then(response => {
      let filtered_response = [];
      for (let i = 0; i < response.data.length; i++) {
        filtered_response.push({
          name: response.data[i].name,
          id: response.data[i].id
        });
      }
      return filtered_response;
    }).catch(error => {
      return null;
    });

    // Adapt requirements
    for (let i=0; i < requirements_list.length; i++) {
      let name = "";
      let description = "";
      let basis = "";
      try {
        name = requirements_list[i].properties.find((x: any) => x.key === "name").value;
      }
      catch {}
      try {
        description = requirements_list[i].properties.find((x: any) => x.key === "description").value;
      }
      catch {}
      try {
        basis = requirements_list[i].properties.find((x: any) => x.key === "basis").value;
      }
      catch {}
      adapted_reqs.push(
        {
          "number": "",
          "labelIds": [],
          "sortNumber": "",
          "classId": 22,
          "createdIn": 0,
          "modifiedIn": 0,
          "linkedLabelId": 0,
          "controlStep": null,
          "controlType": "SERIAL",
          "branches": [],
          "isArchived": false,
          "isLocked": false,
          "projectId": parseInt(project_id),
          "globalId": ids[i].globalId,
          "isRedacted": false,
          "id": ids[i].id,
          "name": name,
          "description": description,
          "version": 1,
          "attrs":{"52": basis} // rationale
        }
      )
    }

    return adapted_reqs;
  }

  async push_requirements(requirements: any, org_slug: string, project_id: string) {
    let response: any = await axios.post(
      `${process.env.INNOSLATE_HOST}/o/${org_slug}/entities`,
      requirements,
      {
        headers: {
          Authorization: `basic ${this.token}`
        }
      }
    ).then(response => {
      return response.data;
    }).catch(error => {
      return {
        "message": error.message
      }
    });

    return response;
  }

}

export { Innoslate }
