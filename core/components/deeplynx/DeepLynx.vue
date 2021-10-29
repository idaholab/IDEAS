Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>

<div>
  <br>
  <span v-if="get_health && !get_token">Authenticate to Deep Lynx</span>
  <span v-else-if="get_token" style="color:green;">Authenticated</span>
  <span v-else style="color:red;">Not found</span>

  <div v-if="get_token" class="selector">
    <v-select
      :items="get_assets"
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

      get_token_as_method() {
        return this.$store.getters["deep_lynx_token"];
      },
      get_container_as_method() {
        return this.$store.getters["deep_lynx_container"];
      },
      async getAssets() {
        this.$emit('tokenSet', this.get_token_as_method());
        this.$emit('containerSet', this.get_container_as_method())
        await axios.get(`/api/apps/deeplynx/get_assets/${this.get_container_as_method()}/${this.get_token_as_method()}`).then(response => {
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
      assets: [],
      selected_container_id: this.get_container(),
      selected_datasource_id: null,
      selected_asset_id: null,
      post_url: null
    }),
    watch: {
      selected_container_id: async function() {
        await axios.get(`/api/apps/deeplynx/get_assets/${this.get_container_as_method()}/${this.get_token_as_method()}`).then(response => {
          for(var i=0;i<response.data.data.nodes.length;i++) {
            this.assets.push({
              "id": response.data.data.nodes[i].id,
              "name": response.data.data.nodes[i].properties[1].value
            });
          }
        }).catch(error => {
          this.error_message = error;
        });
      }
    },
    computed: {
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
    mounted: function() {
    }
  }
</script>

<style scoped>
  .selector {
    max-width: 50%;
  }

</style>
