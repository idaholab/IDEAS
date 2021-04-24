<template>
    <v-container>
        <div>
        <br>
            Deep Lynx Access:
            <span v-if="deepLynxOpen && !token"><v-btn small v-on:click="authenticate()">Authenticate</v-btn></span>
            <span v-else-if="token" style="color:green;">Authenticated</span>
            <span v-else style="color:red;">Not found</span>

            <div v-if="containers.length" class="selector">
                <br>
                <v-select
                :items="containers"
                item-text="name"
                item-value="id"
                label="Deep Lynx Container"
                v-on:change="getMetatypes"
                placeholder="Deep Lynx Container"
                class="select">
                </v-select>
            </div>
            
            <div v-if="metatypes" class="selector">
                <v-select
                :items="metatypes"
                item-text="name"
                item-value="id"
                label="Deep Lynx Metatypes"
                v-on:change="getNodes"
                placeholder="Deep Lynx Metatypes"
                class="select">
                </v-select>
            </div> 

            <div v-if="nodes" class="selector">
              <v-select
              return-object
              :items="nodes"
              item-text="properties.name"
              item-value="propreties.primary_text"
              label="Deep Lynx Nodes"
              v-on:change="setNode"
              placeholder="Deep Lynx Metatypes"
              class="select">
              </v-select>
            </div> 
           
            {{this.node}}
        </div>
    </v-container>
</template>

<script>
const axios = require('axios');
  export default {
    name: 'DeepLynx',
    components: {
    },
    data: () => ({
        error_message: null,
        url: null,
        deepLynxOpen: false,
        token: null,
        containers: [],
        metatypes: null,
        selected_container_id: null,
        nodes: null,
        node: null
    }),
    methods: {
      setURL(url) {
        this.url = url;
      },
      async authenticate() {
        await axios.get(`${this.url}/deeplynx/token`).then(response => {
            if (response.data) {
              this.token = response.data;
              this.getContainers();
            } else {
              this.error_message = "Token not retrieved from Deep Lynx";
            }
        }).catch(error => {
          console.log(error);
        });
      },
      async getContainers() {
        this.selected_container_id = null;
        await axios.post(`${this.url}/deeplynx/containers`, {token: this.token}).then(response => {
          this.containers = response.data;
        }).catch(error => {
          console.log(error)
        });
      },
      async getMetatypes(id) {
        this.selected_container_id = id;
        this.metatypes = await axios.post(`${this.url}/deeplynx/metatype`, {token: this.token, container_id: this.selected_container_id}).then(response => {
          return response.data;
        }).catch(error => {
          console.log(error);
        })
      },
      async getNodes(metatype) {
        this.nodes = await axios.post(`${this.url}/deeplynx/nodes`, {token: this.token, container_id: this.selected_container_id, metatype_id: metatype}).then(response => {
            return response.data;
        })
        console.log(this.nodes);
      },
      async setNode(node) {
        this.node = node;
      }
    },
    mounted: async function() {
      this.setURL(`${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`);
      await axios.get(`${this.url}/deeplynx/health`).then(response => {
          if (response.data=='OK') {
            this.deepLynxOpen = true;
          } else {
            this.error_message = "Cannot connect to Deep Lynx service";
          }
      }).catch(error => {
        this.error_message = error;
      });
    }
  }
</script>
