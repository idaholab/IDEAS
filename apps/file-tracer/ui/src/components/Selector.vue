Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
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
</template>

<script>
const axios = require('axios');
export default {
  name: 'Selector',
  components: {
  },
  props: {
    sources: Array
  }
  methods: {
    async getObjects(urls) {
      let list_url = urls["list"]
      let transform_url = urls["transform"]

      if (urls["auth"]) {
        let response = await axios.get(urls["auth"]);
        this.token = response.data.token;
        this.user_id = response.data.user_id;
        list_url += `/${this.token}/${this.user_id}`;
        transform_url += `/${this.token}/${this.user_id}`;
      }

      axios.get(list_url).then(response => {
        this.objects = response.data.objects;
      }).catch(error => {
        this.error_message = error;
      });

      this.transformURL = transform_url;
    },
    setDeepLynxURLs(urls) {
      this.deepLynxURLs = urls;
    }
  },
  data: () => ({


      error_message: null,
      objects: null,
      token: null,
      user_id: null,

  })
}
</script>

<style scoped>
.selector {
 max-width: 100%;
}
</style>
