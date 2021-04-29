<template>
    <v-container>
        <div>
        <br>
            Deep Lynx Access:
            <span v-if="deep_lynx.open && !deep_lynx.token"><v-btn small v-on:click="authenticate()">Authenticate</v-btn></span>
            <span v-else-if="deep_lynx.token" style="color:green;">Authenticated</span>
            <span v-else style="color:red;">Not found</span>

            <div v-if="deep_lynx.containers" class="selector">
                <br>
                <v-select
                :items="deep_lynx.containers"
                item-text="name"
                item-value="id"
                label="Deep Lynx Container"
                v-on:change="getMetatypes"
                placeholder="Deep Lynx Container"
                class="select">
                </v-select>
            </div>
            
            <div v-if="deep_lynx.metatypes" class="selector">
                <v-select
                :items="deep_lynx.metatypes"
                item-text="name"
                item-value="id"
                label="Deep Lynx Metatypes"
                v-on:change="getNodes"
                placeholder="Deep Lynx Metatypes"
                class="select">
                </v-select>
            </div> 

            <div v-if="deep_lynx.nodes" class="selector">
              <v-select
              return-object
              :items="deep_lynx.nodes"
              item-text="properties.name"
              item-value="propreties.primary_text"
              label="Deep Lynx Nodes"
              v-model="state.node"
              placeholder="Deep Lynx Nodes"
              class="select">
              </v-select>
            </div> 
           

           <template v-if="state.node">
            properties: {{this.state.node.properties}} <br />
            id: {{this.state.node.id}} <br />
            metatype: {{this.state.node.metatype_name}} <br />
            graph id:{{this.state.node.graph_id}} <br />
           </template>

            <br />
            <template v-if="state.node">
              <v-btn v-on:click="getGraph">Get Related Nodes</v-btn>
            </template>
            <br /><br />

            <br />
            <template v-if="state.graph">
              <div v-for="node in state.graph" :key="node.id">
                properties: {{node.properties}} <br />
                id: {{node.id}} <br />
                metatype: {{node.metatype_name}} <br />
                graph id: {{node.graph_id}}
                <br /><br /><br />
              </div>
              
            </template>


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
      deep_lynx: {
        open: false,
        url: null,
        token: null,
        containers: null,
        metatypes: null,
        nodes: null
      },

      state: {
        error: null,
        container: null,
        node: null,
        graph: null
      }
    }),
    methods: {
      setURL(url) {
        this.deep_lynx.url = url;
      },
      async authenticate() {
        this.deep_lynx.token = await axios.get(`${this.deep_lynx.url}/deeplynx/token`).then(response => {
            if (response.data) {
              return response.data;
            } else {
              this.state.error = "Token not retrieved from Deep Lynx";
              return
            }
        }).catch(error => {
          console.log(error);
        });

        await this.getContainers();
      },
      async getContainers() {
        this.state.container = null;

        this.deep_lynx.containers = await axios.post(`${this.deep_lynx.url}/deeplynx/containers`, {token: this.deep_lynx.token}).then(response => {
          return response.data;
        }).catch(error => {
          console.log(error)
        });
      },
      async getMetatypes(id) {
        this.state.container = id;
        this.deep_lynx.nodes = null;
        this.state.node = null;
        this.state.graph = null;
        this.deep_lynx.metatypes = await axios.post(`${this.deep_lynx.url}/deeplynx/metatype`, {token: this.deep_lynx.token, container_id: this.state.container}).then(response => {
          return response.data;
        }).catch(error => {
          console.log(error);
        })
      },
      async getNodes(metatype) {
        this.deep_lynx.nodes = null;
        this.state.node = null;
        this.state.graph = null;
        this.deep_lynx.nodes = await axios.post(`${this.deep_lynx.url}/deeplynx/nodes`, {token: this.deep_lynx.token, container_id: this.state.container, metatype_id: metatype}).then(response => {
            return response.data;
        })
      },
      async getGraph() {
        this.state.graph = await axios.post(`${this.deep_lynx.url}/deeplynx/graph`, {token: this.deep_lynx.token, container_id: this.state.container, node: this.state.node}).then(response => {
          return response.data;
        })
      }
    },
    mounted: async function() {
      this.setURL(`${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`);
      await axios.get(`${this.deep_lynx.url}/deeplynx/health`).then(response => {
          if (response.data=='OK') {
            this.deep_lynx.open = true;
          } else {
            this.state.error = "Cannot connect to Deep Lynx service";
          }
      }).catch(error => {
        this.state.error = error;
      });

    }
  }
</script>
