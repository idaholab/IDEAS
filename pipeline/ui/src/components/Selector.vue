Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
<v-container>
  <v-row>
    <v-col>
      <div class="selector">
        <v-select 
          :items="sources" 
          item-text="name"
          item-value="url"
          label="Source"
          v-on:change="getObjects"
          placeholder="Source"
          class="select">
        </v-select>
      </div>

      <div class="selector">
        <v-select 
        :items="destinations" 
        item-text="name"
        item-value="url"
        label="Destination"
        v-on:change="setURL"
        placeholder="Destination"
        class="select">
        </v-select>
      </div>

      <template v-if="this.url == deep_lynx_url">
        <div class="selector">
          <v-select
            :items="containers"
            item-text="name"
            item-value="id"
            label="Container"
            v-on:change="setContainer"
            placeholder="Container"
            >
          </v-select>
            <template v-if="this.container != null">
              <v-select
                :items="data_sources"
                item-text="name"
                item-value="id"
                label="Data Sources"
                v-on:change="setDataSource"
                placeholder="Data Source"
                >
              </v-select>
            </template>
        </div>
      </template>
      

    </v-col>
  
    <v-col>
    <template v-if="objects">
      <Objects :objects="objects" :url="url" :token="token" :container="container" :data_source="data_source" class="objects"/>
    </template>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import Objects from './Objects.vue';
const axios = require('axios');

  export default {
    name: 'Selector',
    components: {
      Objects
    },
    methods: {
      async getObjects(url) {

        this.objects = await axios.get(url).then(response => {
          return response.data.projects;
        });
      },
      setURL(url) {
        // Clear child prop container
        this.container = null;

        this.url = url;
      },
      async setContainer(container) {
        // Clear child prop data_source 
        this.data_source = null;

        this.container = container;
        await this.getDataSources(container);
      },
      async getDataSources(container) {
        this.data_sources = await axios.get(`${process.env.VUE_APP_DEEP_LYNX_HOST}:${process.env.VUE_APP_DEEP_LYNX_PORT}/containers/${container}/import/datasources`, {
          headers: {
            Authorization: `bearer ${this.token}`
          }
        }).then(response => {return response.data.value});
      },
      setDataSource(data_source) {
        this.data_source = data_source;
      }
    },
    data: () => ({
      deep_lynx_url: `${process.env.VUE_APP_DEEP_LYNX_HOST}:${process.env.VUE_APP_DEEP_LYNX_PORT}`,
      objects: null,
      token: null,
      sources: [
        {name: "Innoslate", url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/innoslate/`}
      ],
      destinations: [
        {name: "deep-lynx", url: `${process.env.VUE_APP_DEEP_LYNX_HOST}:${process.env.VUE_APP_DEEP_LYNX_PORT}`},
        {name: "test", url: "/test"}
      ],
      url: null,
      containers: [],
      container: null,
      data_sources: [],
      data_source: null
    }),
    mounted: async function() {
      this.token = await axios.get(`${process.env.VUE_APP_DEEP_LYNX_HOST}:${process.env.VUE_APP_DEEP_LYNX_PORT}/oauth/token`,
        {
          headers: {
            'x-api-key': process.env.VUE_APP_DEEP_LYNX_X_API_KEY,
            'x-api-secret': process.env.VUE_APP_DEEP_LYNX_X_API_SECRET,
            'x-api-expiry': '10hr'
          }
        }
      ).then(response => {return response.data});

      this.containers = await axios.get(`${process.env.VUE_APP_DEEP_LYNX_HOST}:${process.env.VUE_APP_DEEP_LYNX_PORT}/containers`, 
        {
          params: {
            offset: 0,
            limit: 100
          },
          headers: {
            Authorization: `bearer ${this.token}`
          }
        }
      ).then(response => {return response.data.value});
    }, 
  }
</script>

<style scoped>
.selector {
  max-width: 50%;
}
</style>