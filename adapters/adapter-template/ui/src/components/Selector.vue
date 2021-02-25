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
      <div>
        <DeepLynx/>
      </div>
    </v-col>

    <v-col>
    <template v-if="objects">
      <Objects :objects="objects" :url="url" class="objects"/>
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
      getObjects(url) {
        axios.get(url).then(response => {
          this.objects = response.data.objects;
        }).catch(error => {
          this.error_message = error;
        });
      },
      setURL(url) {
        this.url = url
      }
    },
    data: () => ({
      error_message: null,
      objects: null,
      sources: [
        {name: "Example users", url: `http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}/datasource/get_all_users`},
        {name: "Example posts", url: `http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}/datasource/get_all_posts`}
      ],
      url: null
    })
  }
</script>

<style scoped>
.selector {
  max-width: 50%;
}
</style>
