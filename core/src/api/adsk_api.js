import { Config } from './config'
import buildURL from 'build-url'
const axios = require('axios').default

export class ADSKClient {
  constructor () {
    this.config = Config.Instance()
  }

  healthCheck () {
    return this.get('/')
  }

  serviceDescribe (service_type, service) {
    return this.get(
      `/soap/${service_type}/${service}/describe/NONE/NONE`
    )
  }

  serviceGet (service_type, service, service_function, token, userId, get_data) {
    return this.get(
      `/soap/${service_type}/${service}/${service_function}/${token}/${userId}`,
      get_data
    )
  }

  async get (uri, queryParams) {
    const config = {}
    config.headers = {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'multipart/form-data'
    }

    let url

    if (queryParams) {
      url = buildURL(this.config.vaultUrl, { path: uri, queryParams: queryParams })
    } else {
      url = buildURL(this.config.vaultUrl, { path: uri })
    }

    return new Promise((resolve, reject) => {
      axios.get(url, config).then(resp => {
        if (resp.status < 200 || resp.status > 299) reject(resp.status)

        if (resp.data.isError) reject(resp.data)

        resolve(resp.data)
      }).catch(e => {
        reject(e)
      })
    })
  }

  async post (uri, data) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*' }

    const resp = await axios.post(buildURL(this.config.vaultUrl, { path: uri }), data, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      if (resp.data.isError) reject(resp.data)

      resolve(resp.data)
    })
  }

  async postText (uri, data) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' }

    const resp = await axios.post(buildURL(this.config.vaultUrl, { path: uri }), data, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      if (resp.data.isError) reject(resp.data)

      resolve(resp.data)
    })
  }

  async postFile (uri, inputName, file) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'multipart/form-data' }

    const formData = new FormData()
    formData.append(inputName, file)

    const resp = await axios.post(buildURL(this.config.vaultUrl, { path: uri }), formData, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      resolve(true)
    })
  }

  async delete (uri) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*' }

    const resp = await axios.delete(buildURL(this.config.vaultUrl, { path: uri }), config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      resolve(true)
    })
  }

}

export default function ADSKClientPlugin (Vue) {
  Vue.prototype.$adsk_client = new ADSKClient()
}
