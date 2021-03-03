Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>

<div>
  <br>
  Deep Lynx Access:
  <span v-if="deepLynxOpen && !token" style="color:orange;"><v-btn small color="warning" v-on:click="authenticate()">Authenticate</v-btn></span>
  <span v-else-if="token" style="color:green;">Authenticated</span>
  <span v-else style="color:red;">Not found</span>

  <div v-if="containers.length" class="selector">
    <br>
    <v-select
      :items="containers"
      item-text="name"
      item-value="id"
      label="Deep Lynx Container"
      v-on:change="getDatasources"
      placeholder="Deep Lynx Container"
      class="select">
    </v-select>
  </div>

  <div v-if="datasources.length" class="selector">
    <v-select
      :items="datasources"
      item-text="name"
      item-value="id"
      label="Deep Lynx Datasource"
      v-on:change="setDatasource"
      placeholder="Deep Lynx Datasource"
      class="select">
    </v-select>
  </div>

</div>


</template>

<script>
const axios = require('axios');
  export default {
    name: 'DeepLynx',
    components: {
    },
    methods: {
      setURL(url) {
        this.url = url;
      },
      authenticate() {
        this.unsetPostURL();
        axios.get(`${this.url}/deeplynx/get_token`).then(response => {
            if (response.data.token) {
              this.token = response.data.token;
              this.getContainers();
            } else {
              this.error_message = "Token not retrieved from Deep Lynx";
            }
        }).catch(error => {
          this.error_message = error;
        });
      },
      getContainers() {
        this.selected_container_id = null;
        this.datasources = [];
        this.selected_datasource_id = null;
        this.unsetPostURL();
        axios.get(`${this.url}/deeplynx/get_containers/${this.token}`).then(response => {
          this.containers = response.data.containers;
        }).catch(error => {
          this.error_message = error;
        });
      },
      getDatasources(ident) {
        this.selected_datasource_id = null;
        this.unsetPostURL();
        axios.get(`${this.url}/deeplynx/get_datasources/${ident}/${this.token}`).then(response => {
          this.datasources = response.data.datasources;
        }).catch(error => {
          this.error_message = error;
        });
      },
      setDatasource(ident) {
        this.selected_datasource_id = ident;
        this.setPostURL();
      },
      unsetPostURL() {
        this.post_url = null;
        this.$emit('clicked', this.post_url);
      },
      setPostURL() {
        this.post_url = `${this.url}/deeplynx/manual_import/${this.selected_container_id}/${this.selected_datasource_id}/${this.token}`;
        this.$emit('clicked', this.post_url);
      }
    },
    data: () => ({
      error_message: null,
      url: null,
      deepLynxOpen: false,
      token: null,
      containers: [],
      datasources: [],
      selected_container_id: null,
      selected_datasource_id: null,
      post_url: null
    }),
    mounted: function() {
      this.setURL(`http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`);
      this.unsetPostURL();
      axios.get(`${this.url}/deeplynx/health`).then(response => {
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

<style scoped>
  .selector {
    max-width: 50%;
  }
</style>