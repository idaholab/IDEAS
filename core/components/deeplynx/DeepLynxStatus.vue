Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
  <div class-="wrapper">
    <v-btn class="dl_button" @click="open_modal()">
      Deep Lynx &nbsp;&nbsp; <span class="status"><TrafficLight :status="get_status"/></span>
    </v-btn>
    <Modal class="appBarModal" v-show="isModalVisible" @close="close_modal">
      <template v-slot:header>
        Deep Lynx
      </template>
      <template v-slot:body>
        <div class="appBarModalBody">
          <div class="error_message" v-if="error_message">{{ error_message }}</div>
          <div v-if="get_health">
            <table>
              <tr v-if="get_health && get_token">
                <td style="color:white;">Authentication</td>
                <td style="color:white;"> &nbsp;&nbsp;:&nbsp;&nbsp; </td>
                <td style="color:green;">Authenticated</td>
              </tr>
              <tr v-if="get_token && get_container">
                <td style="color:white;">Container</td>
                <td style="color:white;"> &nbsp;&nbsp;:&nbsp;&nbsp; </td>
                <td style="color:green;">{{ get_container_name }}</td>
              </tr>
              <tr v-if="get_token && get_datasource">
                <td style="color:white;">Datasource</td>
                <td style="color:white;"> &nbsp;&nbsp;:&nbsp;&nbsp; </td>
                <td style="color:green;">{{ get_datasource_name }}</td>
              </tr>
            </table>

            <span v-if="get_health && !get_token" style="color:orange;">
              <form @submit.prevent="authenticate">
                <table>
                  <tr>
                    <td>Key</td>
                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                    <td><input type="text" name="key"></td>
                  </tr>
                  <tr>
                    <td>Secret</td>
                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                    <td><input type="password" name="secret"></td>
                  </tr>
                </table>
                <br><br>
                <v-btn color="warning" type="submit">
                  Authenticate
                </v-btn>
              </form>
              <!-- <v-btn color="warning" v-on:click="authenticate()">
                Authenticate
              </v-btn> -->
            </span>

            <div v-if="get_token && !get_container" class="selector">
              <br>
              <v-select
                :items="containers"
                item-text="name"
                item-value="id"
                label="Deep Lynx Container"
                v-on:change="setContainer"
                placeholder="Deep Lynx Container"
                class="select"
                color="#4ebf94">
              </v-select>
            </div>

            <div v-if="get_container && !get_datasource" class="selector">
              <br>
              <v-select
                :items="datasources"
                item-text="name"
                item-value="id"
                label="Deep Lynx Datasources"
                v-on:change="setDatasource"
                placeholder="Deep Lynx Datasource"
                class="select"
                color="#4ebf94">
              </v-select>
            </div>
            <div v-if="get_token && get_container">
              <br><br><v-btn color="danger" v-on:click="reset()">Reset</v-btn>
            </div>

          </div>
          <div v-else>
            Cannot connect to Deep Lynx instance.
          </div>
        </div>
      </template>
    </Modal>
  </div>

</template>

<script>
  const axios = require('axios')
  import TrafficLight from '@/../components/status/TrafficLight'
  import Modal from '@/../components/modal/Modal'
  export default {
    name: 'DeepLynxStatus',
    data: () => ({
      isModalVisible: false,
      error_message: null,
      containers: [],
      datasources: []
    }),
    components: {
      TrafficLight,
      Modal
    },
    computed: {
      get_status() {
        if (this.$store.getters["deep_lynx_health"] &&
            this.$store.getters["deep_lynx_token"] &&
            this.$store.getters["deep_lynx_container"] &&
            this.$store.getters["deep_lynx_datasource"]
          ) {
              return true;
            } else {
              return false;
            }
      },
      get_health() {
        return this.$store.getters["deep_lynx_health"];
      },
      get_token() {
        return this.$store.getters["deep_lynx_token"];
      },
      get_container() {
        return this.$store.getters["deep_lynx_container"];
      },
      get_container_name() {
        let container_id = this.$store.getters["deep_lynx_container"];
        if (container_id) {
          return this.containers.find(x => x.id === container_id).name;
        } else {
          return null;
        }
      },
      get_containers() {
        return this.containers;
      },
      get_datasource() {
        return this.$store.getters["deep_lynx_datasource"];
      },
      get_datasource_name() {
        let datasource_id = this.$store.getters["deep_lynx_datasource"];
        if (datasource_id) {
          return this.datasources.find(x => x.id === datasource_id).name;
        } else {
          return null;
        }
      },
      get_datasources() {
        return this.datasources;
      },
    },
    methods: {
      set_health() {
        axios.get("/api/apps/deeplynx/health").then(response => {
          if (response.data.value == "OK") {
            this.$store.commit('set_deep_lynx_health', response.data.value);
          } else {
            this.$store.commit('set_deep_lynx_health', false);
          }
        }).catch(error => {
          this.error_message = error;
          this.$store.commit('set_deep_lynx_health', false);
        });
      },

      get_token_as_method() {
        return this.$store.getters["deep_lynx_token"];
      },

      set_token(token) {
        this.$store.commit('set_deep_lynx_token', token);
      },

      authenticate(submitEvent) {
        let key = submitEvent.target.elements.key.value;
        let secret = submitEvent.target.elements.secret.value;

        axios.get(`/api/apps/deeplynx/get_token/${key}/${secret}`).then(response => {
            if (response.data.token) {
              this.set_token(response.data.token);
              this.getContainers(response.data.token);
            } else {
              this.error_message = "Token not retrieved from Deep Lynx";
            }
        }).catch(error => {
          this.error_message = error;
        });
      },

      reset() {
        this.$store.commit('set_deep_lynx_token', null);
        this.$store.commit('set_deep_lynx_container', null);
        this.$store.commit('set_deep_lynx_datasource', null);
      },

      getContainers(token) {
        axios.get(`/api/apps/deeplynx/get_containers/${token}`).then(response => {
          this.containers = response.data.containers;
        }).catch(error => {
          this.error_message = error;
        });
      },
      setContainer(ident) {
        this.$store.commit('set_deep_lynx_container', ident);
        axios.get(`/api/apps/deeplynx/get_datasources/${ident}/${this.get_token_as_method()}`).then(response => {
          this.datasources = response.data.datasources;
        }).catch(error => {
          this.error_message = error;
        });
      },
      setDatasource(ident) {
        this.$store.commit('set_deep_lynx_datasource', ident);
      },

      open_modal() {
        this.isModalVisible = true;
      },
      close_modal () {
        this.isModalVisible = false
      }
    },
    mounted: function() {
      this.set_health()
    }
  }
</script>

<style scoped>
.dl_button {
  margin: 0.5rem;
  display: flex;
  overflow: hidden;
  background-color: black;
  white-space: nowrap;
}

.status {
  margin-top: 0.6rem;
  font-size: 1.25rem;
  display: flex;
  flex-wrap: nowrap;
  height: 2rem;
  overflow: hidden;
}

.appBarModal {
  position:  fixed;
   top: calc(50vh);
   z-index: 100;
}

.appBarModalBody {
   color: white !important;
   margin: 2rem;
}

.error_message {
  color: red;
}

input {
  background-color: white;
  border-radius: 0.25rem;
  margin: 0.25rem;
}

</style>
