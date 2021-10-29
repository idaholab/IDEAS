import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    adapters: [
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
            'name': 'Show Files in a Folder',
            'extension': '/:vault/folder/:folder_id/files',
            'method': 'GET',
            'auth': "basic"
          },
          {
            'name': 'Get a Single File',
            'extension': '/:vault/get_file/:file_id',
            'method': 'GET',
            'auth': "basic"
          }
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
            'name': "Push Requirements",
            'extension': '/push_requirements',
            'method': 'GET',
            'auth': null
          }
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
        "InformationService"
      ],
      filestore_services : [
        "AuthService",
        "FilestoreService",
        "FilestoreVaultService",
        "IdentificationService"
      ],
      standard_services: [
        "AdminService",
        "BehaviorService",
        "CategoryService",
        "ChangeOrderService",
        //"ContentService", // our instance doesn't respond
        "CustomEntityService",
        "DocumentService",
        "DocumentServiceExtensions",
        "ForumService",
        "ItemService",
        "JobService",
        "KnowledgeLibraryService",
        "KnowledgeVaultService",
        "LifeCycleService",
        "NumberingService",
        //"PackageService", // our instance doesn't respond
        "PropertyService",
        "ReplicationService",
        "RevisionService",
        "SecurityService",
        "SharePointService"
      ]
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
    }
  }
})

export default store
