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
      return response.data
    });

    return response;
  }

  async get_projects(organization_name: string) {
    let response: any = await axios.get(
      `${this.base_url}/o/${organization_name}/p`,
      { headers: { Authorization: `basic ${this.token}` } }
    ).then(response =>{
      return response.data
    });

    return response;
  }
}

export { Innoslate }
