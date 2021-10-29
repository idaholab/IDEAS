import { Config } from './config'
import buildURL from 'build-url'
const axios = require('axios').default

export class Client {
  constructor () {
    this.config = Config.Instance()
  }

  listContainers () {
    return this.get('/containers')
  }

  createDataSource (containerID) {
    return this.post(`/containers/${containerID}/import/datasources`,
      { adapter_type: 'standard', active: true, name: this.config.dataSourceName, config: { data_format: 'json' } })
  }

  listDataSources (containerID) {
    return this.get(`/containers/${containerID}/import/datasources`)
  }

  createImport (containerID, dataSourceID, data) {
    return this.post(`/containers/${containerID}/import/datasources/${dataSourceID}/imports`, data)
  }

  listImports (containerID, dataSourceID) {
    return this.get(`/containers/${containerID}/import/datasources/${dataSourceID}/imports`)
  }

  listImportData (containerID, importID) {
    return this.get(`/containers/${containerID}/import/imports/${importID}/data`)
  }

  queryGraph (containerID, data) {
    return this.postText(`/containers/${containerID}/query`, data)
  }

  deleteNode (containerID, nodeID) {
    return this.delete(`/containers/${containerID}/graphs/nodes/${nodeID}`)
  }

  listRegisteredEvents () {
    return this.get('events')
  }

  createRegisteredEvent (data) {
    return this.post('events', data)
  }

  async get (uri, queryParams) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*' }

    let url

    if (queryParams) {
      url = buildURL(this.config.deepLynxUrl, { path: uri, queryParams: queryParams })
    } else {
      url = buildURL(this.config.deepLynxUrl, { path: uri })
    }

    return new Promise((resolve, reject) => {
      axios.get(url, config).then(resp => {
        if (resp.status < 200 || resp.status > 299) reject(resp.status)

        if (resp.data.isError) reject(resp.data.value)

        resolve(resp.data.value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  async post (uri, data) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*' }

    const resp = await axios.post(buildURL(this.config.deepLynxUrl, { path: uri }), data, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      if (resp.data.isError) reject(resp.data.value)

      resolve(resp.data.value)
    })
  }

  async postText (uri, data) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' }

    const resp = await axios.post(buildURL(this.config.deepLynxUrl, { path: uri }), data, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      if (resp.data.isError) reject(resp.data.value)

      resolve(resp.data.data)
    })
  }

  async postFile (uri, inputName, file) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'multipart/form-data' }

    const formData = new FormData()
    formData.append(inputName, file)

    const resp = await axios.post(buildURL(this.config.deepLynxUrl, { path: uri }), formData, config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      resolve(true)
    })
  }

  async delete (uri) {
    const config = {}
    config.headers = { 'Access-Control-Allow-Origin': '*' }

    const resp = await axios.delete(buildURL(this.config.deepLynxUrl, { path: uri }), config)

    return new Promise((resolve, reject) => {
      if (resp.status < 200 || resp.status > 299) reject(resp.status)
      resolve(true)
    })
  }

  async verifyContainer () {
    return await this.listContainers().then(containers => {
      if (containers.isError) return containers
      const containerIndex = containers.findIndex(i => i.name === this.config.containerName)
      if (containerIndex !== -1) {
        this.config.setContainerID(containers[containerIndex].id)
      } else {
        containers.isError = true
        containers.error = `Container with name ${this.config.containerName} not found`
      }
      return containers
    }).catch(e => {
      return e
    })
  }

  async verifyDataSource () {
    const dataSources = await this.listDataSources(this.config.containerID)
    if (dataSources.isError) return dataSources
    const dataSourceIndex = dataSources.findIndex(i => i.name === this.config.dataSourceName)
    if (dataSourceIndex !== -1) {
      this.config.setDataSourceID(dataSources[dataSourceIndex].id)
      return dataSources
    } else {
      const newDataSource = await this.createDataSource(this.config.containerID)
      if (newDataSource.isError) return newDataSource
      this.config.setDataSourceID(newDataSource.id)
      return newDataSource
    }
  }

  async verifyDeepLynx () {
    return await this.verifyContainer().then(container => {
      if (!container.isError && !container.isAxiosError) {
        return this.verifyDataSource().then(datasource => {
          return datasource
        }).catch(e => {
          return e
        })
      }
      return container
    }).catch(e => {
      return e
    })
  }

  async createManualImport (data) {
    const manualImport = await this.createImport(this.config.containerID,
      this.config.dataSourceID, data)
    if (manualImport.isError) return false
    else return true
  }
}

export default function ClientPlugin (Vue) {
  Vue.prototype.$client = new Client()
}
