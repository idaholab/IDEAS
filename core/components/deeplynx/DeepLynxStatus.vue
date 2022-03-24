Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
  <div class-="wrapper">
    <v-btn class="dl_button" @click="open_modal()">
      Deep Lynx &nbsp;&nbsp; <span class="status"><TrafficLight :status="get_status"/></span>
    </v-btn>
    <ModalForm @submit="authenticate" class="appBarModal" v-show="isModalVisible" @close="close_modal">
      <template v-slot:header>
        Deep Lynx
      </template>
      <template v-slot:body>
        <div class="appBarModalBody">
          <div class="error_message" v-if="error_message">{{ error_message }}</div>
          <div v-if="get_health">

            <span v-if="get_health" style="color:#4ebf94;">
              <form @submit.prevent="authenticate">
                <table>
                  <tr>
                    <td>Key</td>
                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                    <td><input type="text" name="key" v-model="key"></td>
                  </tr>
                  <tr>
                    <td>Secret</td>
                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                    <td><input type="password" name="secret" v-model="secret"></td>
                  </tr>
                </table>
                <br><br>
              </form>
            </span>

            <div v-if="get_token" class="selector">
              <br>
              <v-select
                :items="containers"
                item-text="name"
                item-value="id"
                label="Deep Lynx Container"
                @input="setContainer"
                placeholder="Deep Lynx Container"
                class="select"
                color="#4ebf94"
                >
              </v-select>
            </div>

            <div v-if="get_container" class="selector">
              <br>
              <v-select
                :items="datasources"
                item-text="name"
                item-value="id"
                label="Deep Lynx Datasources"
                @input="setDatasource"
                placeholder="Deep Lynx Datasource"
                class="select"
                color="#4ebf94"
                >
              </v-select>
            </div>

            <div v-if="get_token">
              <br><br><v-btn color="danger" v-on:click="reset()">Reset</v-btn>
            </div>

          </div>
          <div v-else>
            Cannot connect to Deep Lynx instance.
          </div>
        </div>
      </template>
    </ModalForm>
  </div>

</template>

<script>
  const axios = require('axios')
  import TrafficLight from '@/../components/status/TrafficLight'
  import ModalForm from '@/../components/modal/ModalForm'
  export default {
    name: 'DeepLynxStatus',
    data: () => ({
      isModalVisible: false,
      error_message: null,
      containers: [],
      datasources: [],
      key: '',
      secret: ''
    }),
    components: {
      TrafficLight,
      ModalForm
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
      }
    },
    methods: {
      set_health() {
        axios.get("/api/apps/deeplynx/health").then(response => {
          if (response.data[0].value == "OK") {
            this.$store.commit('set_deep_lynx_health', true);
          } else {
            this.$store.commit('set_deep_lynx_health', false);
          }
        }).catch(error => {
          this.error_message = error;
          this.$store.commit('set_deep_lynx_health', false);
        });
      },

      set_token(token) {
        this.$store.commit('set_deep_lynx_token', token);
      },

      authenticate() {
        let key = this.key;
        let secret = this.secret;

        axios.get(`/api/apps/deeplynx/get_token/${key}/${secret}`).then(response => {
            if (response.data[0].token) {
              this.set_token(response.data[0].token);
              this.getContainers(response.data[0].token);
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
        this.containers = []
        this.datasources = []
      },

      async getContainers(token) {
        await axios.get(`/api/apps/deeplynx/get_containers/${token}`).then(response => {
          this.containers = response.data[0].containers;
        }).catch(error => {
          this.error_message = error;
        });
      },
      async setContainer(ident) {
        this.$store.commit('set_deep_lynx_container', ident);
        let token = this.$store.getters["deep_lynx_token"]
        await axios.get(
          `/api/apps/deeplynx/get_datasources/${ident}/${token}`
        ).then(response => {
          this.datasources = response.data[0].datasources;
        }).catch(error => {
          this.error_message = error;
        });
      },
      async setDatasource(ident) {
        await this.$store.commit('set_deep_lynx_datasource', ident);
        this.close_modal()
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
  top: calc(50vh);
  left: 0;
  right: 0;
  bottom: 0;
  width: 100% !important;
  background: rgba(0, 0, 0, .5) !important;
}

.appBarModalBody {
   color: white !important;
   margin: 2rem;
}

.error_message {
  color: #8C1823;
}

input {
  background-color: white;
  border-radius: 0.25rem;
  margin: 0.25rem;
}

</style>
