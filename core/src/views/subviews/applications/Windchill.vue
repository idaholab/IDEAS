<template>
  <div>
    <h2 class="windchill_title">Windchill</h2><br><br>
    <!-- {{ vault_data }} -->
    <div class="windchill_home">
      <WindchillHealth />

      <ContainerSelector v-if="auth_string!='' && containers"
        v-on:setContainer="set_container"
        :containers="containers"
      />

      <Card v-if="auth_string!='' && container_root" icon="mdi-file-cabinet" cardTitle="Browse">

        <div>

          <TreeSelector
            :nodes="container_root.Folders"
            :ident="container_root.ID"
            :name="container_root.Name"
            :depth="0"
            :key="container_root.ID"
            @bus="bus"
          />
        </div>

      </Card>

      <FolderActions
        v-if="folder_id && folder_name && container_id"
        :containerId="container_id"
        :folderId="folder_id"
        :folderName="folder_name"
        :authString="auth_string"
      />

      <Login v-if="auth_string==''" v-on:setAuthString="setAuthString"/>

      <Card v-else icon="mdi-logout-variant" cardTitle="Log out">
        <v-btn @click="logout">Logout</v-btn>
      </Card>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Card from '@/../components/card/Card.vue'
import WindchillHealth from './Windchill/WindchillHealth.vue'
import ContainerSelector from './Windchill/ContainerSelector.vue'
import TreeSelector from './Windchill/TreeSelector.vue'
import FolderActions from './Windchill/FolderActions.vue'
import Login from './Windchill/Login.vue'
export default {
  name: 'Windchill',
  data: () => ({
    health: false,
    hostname: null,
    containers: [],
    container_id: null,
    container_root: null,
    folder_id: null,
    folder_name: null,
    auth_string: ''
  }),
  components: {
    Card,
    WindchillHealth,
    ContainerSelector,
    TreeSelector,
    FolderActions,
    Login
  },
  methods: {
    async check_health () {
      await axios.get('/api/adapters/windchill/health').then(response => {
        if (response.data) {
          if (response.data[0]) {
            if (response.data[0].value == 'OK') {
              this.health = true;
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    async get_hostname() {
      await axios.get('/api/adapters/windchill/hostname').then(response => {
        this.hostname = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    async get_containers() {
      await axios.get(
        `/api/adapters/windchill/containers`,
        {'headers': {'Authorization': `Basic ${this.auth_string}`}}
      ).then(response => {
        this.containers = response.data
      })
    },
    async set_container(e) {
      this.container_id = e
      this.folder_id = null
      this.folder_name = null
      this.get_folders()
    },
    async get_folders() {
      await axios.get(
        `/api/adapters/windchill/folders/${this.container_id}`,
        {'headers': {'Authorization': `Basic ${this.auth_string}`}}
      ).then(response => {
        this.container_root = response.data[0];
      })
    },
    async bus(e) {
      if ("ident" in e) {
        this.folder_id = e.ident
        this.folder_name = e.name
      } else if ("collapse" in e) {
        this.folder_id = null
        this.folder_name = null
      }

    },
    setAuthString(e) {
      this.auth_string = e
      this.get_containers()
    },
    logout() {
      this.auth_string = ''
      this.container_id = null
      this.folder_id = null
      this.folder_name = null
    }
  },
  computed: {
  },
  mounted: function() {
    this.get_hostname()
    this.check_health()
  }
}
</script>

<style scoped>
.windchill_title {
  font-weight: 100;
}

.windchill_home {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hostname_message {
  color: white;
}

.hostname_url {
  color: #4ebf94;
}

.accessible {
  color: #4ebf94;
}

.inaccessible {
  color: #D12335;
}
</style>
