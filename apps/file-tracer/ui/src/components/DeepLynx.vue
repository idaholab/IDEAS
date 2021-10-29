Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

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
      v-on:change="getAssets"
      placeholder="Deep Lynx Container"
      class="select"
      color="#4ebf94">
    </v-select>
  </div>

  <div v-if="assets.length" class="selector">
    <v-select
      :items="assets"
      item-text="name"
      item-value="id"
      label="Deep Lynx Assets"
      v-on:change="setAsset"
      placeholder="Deep Lynx Asset"
      class="select"
      color="#4ebf94">
    </v-select>
  </div>

  <div v-if="selected_asset_id">
    <span style="font-size:75%;">
      Asset ID
    </span><br>
    {{selected_asset_id}}
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
        this.url = url
      },
      authenticate() {
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
        //this.unsetPostURL();
        axios.get(`${this.url}/deeplynx/get_containers/${this.token}`).then(response => {
          this.containers = response.data.containers;
          console.log(this.containers);
        }).catch(error => {
          this.error_message = error;
        });
      },
      async getAssets(ident) {
        this.selected_container_id = ident;
        this.selected_datasource_id = null;
        this.$emit('containerSet', ident)
        this.$emit('tokenSet', this.token);
        await axios.get(`${this.url}/deeplynx/get_assets/${ident}/${this.token}`).then(response => {
          for(var i=0;i<response.data.data.nodes.length;i++) {
            this.assets.push({
              "id": response.data.data.nodes[i].id,
              "name": response.data.data.nodes[i].properties[1].value
            });
          }
        }).catch(error => {
          this.error_message = error;
        });
      },
      setAsset(ident) {
        this.selected_asset_id = ident;
        this.$emit('assetSet', ident);
      }
    },
    data: () => ({
      error_message: null,
      url: null,
      deepLynxOpen: false,
      token: null,
      containers: [],
      datasources: [],
      assets: [],
      selected_container_id: null,
      selected_datasource_id: null,
      selected_asset_id: null,
      post_url: null
    }),
    mounted: function() {
      this.setURL(`http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`);
      axios.get(`${this.url}/deeplynx/health`).then(response => {
          if (response.data=='OK') {
            this.deepLynxOpen = true;
            this.authenticate();
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
