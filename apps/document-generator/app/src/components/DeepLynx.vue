<template>
    <v-container>
        <v-row>
          <v-col>
            <br>
            Deep Lynx Access:
            <span v-if="$store.getters.open && !$store.getters.auth"><v-btn small v-on:click="authenticate()">Authenticate</v-btn></span>
            <span v-else-if="$store.getters.auth" style="color:green;">Authenticated</span>
            <span v-else style="color:red;">Not found</span>

            <div v-if="$store.getters.containers" class="selector">
                <br>
                <v-select
                :items="$store.getters.containers"
                item-text="name"
                item-value="id"
                v-model="container"
                label="Deep Lynx Container"
                placeholder="Deep Lynx Container">
                </v-select>
            </div>

            <div v-if="$store.getters.nodes" class="selector">
              <v-select
              return-object
              :items="$store.getters.nodes"
              item-text="properties.name"
              item-value="propreties.primary_text"
              label="Deep Lynx Nodes"
              v-model="node"
              placeholder="Deep Lynx Nodes">
              </v-select>
            </div> 
            <br />
            <v-card v-if="$store.getters.document">
              <v-card-title>{{this.$store.getters.document.document.properties.name}}</v-card-title>
              <v-card-subtitle v-html="$store.getters.document.document.properties.primary_text"></v-card-subtitle>
              <v-progress-linear v-if="loading" indeterminate color="#4ebf94">
              </v-progress-linear>
            </v-card>
          </v-col>

          <v-col>
              <Document @render="loading = false" v-if="$store.getters.document" :metadata="$store.getters.document"/>
          </v-col>

        </v-row>
    </v-container>
</template>

<script>
import Document from './Document';
import axios from 'axios';

export default {
  name: 'DeepLynx',
  components: {
    Document
  },
  props: {
    //
  },
  data: () => ({
    loading: true,
    container: null,
    node: null,
    document: null
  }),
  methods: {
    async authenticate() {
      await axios.get(`http://localhost:3232/deeplynx/token`).then(async response => {
          if (response.data) {
            this.$store.commit('auth', response.data);
          } else {
            this.state.error = "Token not retrieved from Deep Lynx";
            return
          }
      }).catch(error => {
        console.log(error);
      });
    },
    async getContainers() {
      await axios.post(`http://localhost:3232/deeplynx/containers`, {token: this.$store.getters.auth}).then(response => {
        if (response.data) {
          this.$store.commit('containers', response.data);
        }
      }).catch(error => {
        console.log(error)
      });
    },
    async getNodes() {
      await axios.post(`http://localhost:3232/deeplynx/nodes`, {token: this.$store.getters.auth, container_id: this.container}).then(response => {
          if (response.data) {
            this.$store.commit('nodes', response.data);
          }
      })
    },
    async generate() {
      this.loading = true;
      await axios.post(`http://localhost:3232/deeplynx/graph`, {token: this.$store.getters.auth, container_id: this.container, node: this.node}).then(response => {
          if (response.data) {
            response.data.generate = true;
            this.$store.commit('document', response.data);
          }
        })
      }
  },
  watch: {
    '$store.state.deeplynx.auth': {
      handler: 'getContainers'
    },
    container: {
      handler: 'getNodes',
      deep: true
    },
    node: {
      handler: 'generate'
    }
  },
  mounted: async function() {
    await axios.get('http://localhost:3232/deeplynx/health').then(response => {
        if (response.status === 200) {
          this.$store.commit('open', response.data);
        } else {
          this.state.error = "Cannot connect to Deep Lynx service";
        }
    }).catch(error => {
      this.state.error = error;
    });
  }
}
</script>