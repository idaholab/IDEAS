// Config is a singleton class
export class Config {
  // provide sane defaults where possible
  constructor () {
    this._deep_lynx_url = process.env.VUE_APP_DEEP_LYNX_URL || 'http://localhost:8090'
    this._deep_lynx_app_id = process.env.VUE_APP_DEEP_LYNX_APP_ID
    this._app_url = process.env.VUE_APP_APP_URL || 'http://localhost:8080'
    this._poll_interval = process.env.VUE_APP_POLL_INTERVAL || 30

    this._vaultapi_address = `/api/apps/vault`
  }

  get vaultUrl () {
    return this._vaultapi_address
  }

  get deepLynxUrl () {
    return this._deep_lynx_url
  }

  setDeepLynxUrl (deepLynxUrl) {
    this._deep_lynx_url = deepLynxUrl
  }

  get containerName () {
    return this._container_name
  }

  setContainerName (containerName) {
    this._container_name = containerName
  }

  get dataSourceName () {
    return this._data_source_name
  }

  setDataSourceName (dataSourceName) {
    this._data_source_name = dataSourceName
  }

  get deepLynxAppID () {
    return this._deep_lynx_app_id
  }

  setDeepLynxAppID (deepLynxAppID) {
    this._deep_lynx_app_id = deepLynxAppID
  }

  get appUrl () {
    return this._app_url
  }

  setAppUrl (appUrl) {
    this._app_url = appUrl
  }

  setContainerID (containerID) {
    this._container_id = containerID
  }

  get containerID () {
    return this._container_id
  }

  setDataSourceID (dataSourceID) {
    this._data_source_id = dataSourceID
  }

  get dataSourceID () {
    return this._data_source_id
  }

  setPollInterval (pollInterval) {
    this._poll_interval = pollInterval
  }

  get pollInterval () {
    return this._poll_interval
  }

  static Instance () {
    if (!Config.instance) {
      Config.instance = new Config()
    }

    return Config.instance
  }
}

export default Config.Instance()
