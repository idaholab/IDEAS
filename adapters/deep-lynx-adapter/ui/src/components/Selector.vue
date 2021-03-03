Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
<v-container>
  <v-row>
    <v-col>
      <div class="selector">
        <v-select
          :items="sources"
          item-text="name"
          item-value="urls"
          label="List Source"
          v-on:change="getObjects"
          placeholder="List Source"
          class="select">
        </v-select>
      </div>
      <div>
        <DeepLynx @clicked="setDeepLynxURL"/>
      </div>
    </v-col>

    <v-col>
    <template v-if="objects">
      <Objects :objects="objects" :transformURL="transformURL" :deepLynxURL="deepLynxURL" class="objects"/>
    </template>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import Objects from './Objects.vue';
import DeepLynx from './DeepLynx.vue';
const axios = require('axios');
  export default {
    name: 'Selector',
    components: {
      Objects,
      DeepLynx
    },
    methods: {
      getObjects(urls) {
        axios.get(urls[0]).then(response => {
          this.objects = response.data.projects;
        }).catch(error => {
          this.error_message = error;
        });
        this.transformURL = urls[1];
      },
      setDeepLynxURL(url) {
        this.deepLynxURL = url;
      }
    },
    data: () => ({
      error_message: null,
      objects: null,
      sources: [
        {
          name: "Innoslate",
          urls: [`http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}/innoslate`, // list source GET
          `http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}/innoslate/document-data`] // transform GET
        },
      ],
      deepLynxURL: null,
      transformURL: null
    })
  }
</script>

<style scoped>
.selector {
  max-width: 50%;
}
</style>