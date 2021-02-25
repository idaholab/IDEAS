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
      async getObjects(url) {
        this.objects = await axios.get(url).then(response => {
          alert(url);
          return response.data.objects;
        });
      },
      setURL(url) {
        this.url = url
      }
    },
    data: () => ({
      objects: null,
      sources: [
        {name: "Example users", url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/datasource/get_all_users`},
        {name: "Example posts", url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/datasource/get_all_posts`}
      ],
      destinations: [
        {name: "deep-lynx", url: `${process.env.VUE_APP_DEEP_LYNX_ADDRESS}`},
        {name: "test", url: "/test"}
      ],
      url: null
    }),
  }
</script>

<style scoped>
.selector {
  max-width: 50%;
}
</style>
