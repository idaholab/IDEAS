import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    adapters: [
      {
        name: "Deep Lynx",
        description: "This adapter exposes the endpoints of the Deep Lynx API",
        base_url: '/api/apps/deeplynx',
        health_url: '/api/apps/deeplynx/health',
        is_active: false,
        endpoints: [
          {
            'name': "Health Check",
            'extension': '/health',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Authentication",
            'extension': '/get_token/:key/:secret',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Containers",
            'extension': '/get_containers/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Files",
            'extension': '/get_files/:container_id/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Datasources",
            'extension': '/get_datasources/:container_id/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Metatype Definition",
            'extension': '/get_metatype_definition/:container_id/:metatype_name/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Links",
            'extension': '/get_links/:container_id/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Assets",
            'extension': '/get_assets/:container_id/:token',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Requirements",
            'extension': '/get_requirements/:container_id/:token',
            'method': 'GET',
            'auth': null
          }
        ]
      },
      {
        name: "Autodesk Vault",
        description: "This adapter pulls CAD files and associated metadata \
        from NRIC's cloud instance of Autodesk Vault. The user must supply \
        a valid username and password as a set in a 'Basic' auth header.",
        base_url: '/api/adapters/vault',
        health_url: '/api/adapters/vault/health',
        is_active: false,
        endpoints: [
          {
            'name': "Health Check",
            'extension': '/health',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Authentication",
            'extension': '/:vault/authenticate',
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': "Get Root Folder",
            'extension': "/:vault/root",
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': 'Get Child Folders',
            'extension': '/:vault/folder/:folder_id/child_folders',
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': 'Add Folder',
            'extension': '/:vault/add_folder/:name/:parent_id',
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': 'Get Items by Change Order',
            'extension': '/:vault/get_co_items/:change_order_id',
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': 'Show Files in a Folder',
            'extension': '/:vault/folder/:folder_id/files',
            'method': 'GET',
            'auth': "basic"
          },
          // {
          //   'name': 'Get a Single File',
          //   'extension': '/:vault/get_file/:file_id',
          //   'method': 'GET',
          //   'auth': "basic"
          // }
        ]
      },
      {
        name: "Innoslate",
        description: "This adapter allows requirement data to be pushed from \
        Deep Lynx to Innoslate.",
        base_url: '/api/adapters/innoslate',
        health_url: '/api/adapters/innoslate/health',
        is_active: false,
        endpoints: [
          {
            'name': "Health Check",
            'extension': '/health',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "List Organizations",
            'extension': '/list_organizations/:key',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "List Projects",
            'extension': '/list_projects/:organization/:key',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Requirements from Deep Lynx",
            'extension' :'/get_deeplynx_requirements/:inno_key/:dl_key/:dl_secret/:dl_container_id',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Requirements from Innoslate",
            'extension' :'/get_innoslate_requirements/:inno_key/:inno_org/:inno_proj',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Push Innoslate Requirements to Deep Lynx",
            'extension' :'/push_innoslate_requirements_to_dl/:inno_key/:organization/:project/:dl_key/:dl_secret/:dl_container_id/:dl_datasource_id',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Push Requirements to Innoslate",
            'extension' :'/push_requirements/:inno_key/:inno_org/:inno_proj/:dl_key/:dl_secret/:dl_container_id',
            'method': 'GET',
            'auth': null
          }
        ]
      },
      {
        name: "Windchill",
        description: "This adapter allows custom actions to be performed on \
        a PTC Windchill instance.",
        base_url: '/api/adapters/windchill',
        health_url: '/api/adapters/windchill/health',
        is_active: false,
        endpoints: [
          {
            'name': "Health Check",
            'extension': '/health',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get NONCE",
            'extension': '/get_nonce',
            'method': 'GET',
            'auth': 'basic'
          },
          {
            'name': "List Organizations",
            'extension': '/containers',
            'method': 'GET',
            'auth': 'basic'
          },
          {
            'name': "Show Container Details",
            'extension': '/containers/:container_id',
            'method': 'GET',
            'auth': 'basic'
          },
          {
            'name': "Show Folder Tree in Container",
            'extension': '/folders/:container_id',
            'method': 'GET',
            'auth': 'basic'
          }
        ]
      },
      {
        name: "Innoslate Reports",
        description: "This adapter allows report generation functions to be \
        called on an Innoslate instance.",
        base_url: '/api/apps/innoslate-reports',
        health_url: '/api/apps/innoslate-reports/health',
        is_active: false,
        endpoints: [
          {
            'name': "Health Check",
            'extension': '/health',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Innoslate Project Documents",
            'extension': '/:o/:p/documents/:key',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Get Document Data",
            'extension': '/:o/report_data/:n/:key',
            'method': 'GET',
            'auth': null
          },
          {
            'name': "Download Report",
            'extension': '/:o/report/:reportType/:n/:key',
            'method': 'GET',
            'auth': null
          },
        ]
      }
    ],
    drawer: null,
    deep_lynx: {
      health: null,
      token: null,
      container: null,
      datasource: null
    },
    vault_data: {
      userId: 'NONE',
      token: 'NONE',
      apiStatus: null,
      information_services: [
        { 'name': "InformationService", 'auth_required': false },
      ],
      filestore_services : [
        { 'name': "AuthService", 'auth_required': false },
        { 'name': "FilestoreService", 'auth_required': true },
        { 'name': "FilestoreVaultService", 'auth_required': true },
        { 'name': "IdentificationService", 'auth_required': false },
      ],
      standard_services: [
        { 'name': "AdminService", 'auth_required': true },
        { 'name': "BehaviorService", 'auth_required': true },
        { 'name': "CategoryService", 'auth_required': true },
        { 'name': "ChangeOrderService", 'auth_required': true },
        //"ContentService", // our instance doesn't respond
        { 'name': "CustomEntityService", 'auth_required': true },
        { 'name': "DocumentService", 'auth_required': true },
        { 'name': "DocumentServiceExtensions", 'auth_required': true },
        { 'name': "ForumService", 'auth_required': true },
        { 'name': "ItemService", 'auth_required': true },
        { 'name': "JobService", 'auth_required': true },
        { 'name': "KnowledgeLibraryService", 'auth_required': true },
        { 'name': "KnowledgeVaultService", 'auth_required': true },
        { 'name': "LifeCycleService", 'auth_required': true },
        { 'name': "NumberingService", 'auth_required': true },
        //"PackageService", // our instance doesn't respond
        { 'name': "PropertyService", 'auth_required': true },
        { 'name': "ReplicationService", 'auth_required': true },
        { 'name': "RevisionService", 'auth_required': true },
        { 'name': "SecurityService", 'auth_required': true },
        { 'name': "SharePointService", 'auth_required': true },
      ]
    },
    message: {
      text: '',
      type: ''
    }
  },
  mutations: {
    set_vault_apiStatus (state, status) {
      state.vault_data.apiStatus = status
    },
    set_vault_userId (state, user_id) {
      state.vault_data.userId = user_id
    },
    set_vault_token (state, token) {
      state.vault_data.token = token
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    set_deep_lynx_health (state, health) {
      state.deep_lynx.health = health
    },
    set_deep_lynx_token (state, token) {
      state.deep_lynx.token = token
    },
    set_deep_lynx_container (state, container) {
      state.deep_lynx.container = container
    },
    set_deep_lynx_datasource (state, datasource) {
      state.deep_lynx.datasource = datasource
    },
    set_message_text (state, text) {
      state.message.text = text
    },
    set_message_type (state, type) {
      state.message.type = type
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    adapters: (state) => {
      return state.adapters
    },
    vault_data: (state) => {
      return state.vault_data
    },
    test: (state) => {
      return state.vault_data
    },
    vault_token: (state) => {
      return state.vault_data.token
    },
    vault_userId: (state) => {
      return state.vault_data.userId
    },
    deep_lynx_health: (state) => {
      return state.deep_lynx.health
    },
    deep_lynx_token: (state) => {
      return state.deep_lynx.token
    },
    deep_lynx_container: (state) => {
      return state.deep_lynx.container
    },
    deep_lynx_datasource: (state) => {
      return state.deep_lynx.datasource
    },
    message_text: (state) => {
      return state.message.text
    },
    message_type: (state) => {
      return state.message.type
    }
  }
})

export default store
