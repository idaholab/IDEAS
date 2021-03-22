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
        <DeepLynx @clicked="setDeepLynxURLs"/>
      </div>
    </v-col>

    <v-col>
    <template v-if="objects">
      <Objects :objects="objects" :transformURL="transformURL" :deepLynxURLs="deepLynxURLs" class="objects"/>
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
    data () {
      let host = `http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`;
      return {
        error_message: null,
        objects: null,
        token: null,
        user_id: null,
        sources: [
          {
            name: "Innoslate (Document Data)",
            urls: {
              "auth": null,
              "list": `${host}/innoslate`, // list source GET
              "transform": `${host}/innoslate/document-data` // transform GET
            }
          },
          {
            name: "Innoslate (Non-Document Data)",
            urls: {
              "auth": null,
              "list": `${host}/innoslate`, // list source GET
              "transform": `${host}/innoslate/non-document-data` // transform GET
            }
          },
          {
            name: "Vault Items (History)",
            urls: {
              "auth": `${host}/vault/authenticate`,
              "list": `${host}/vault/get_item_list`, // list source GET
              "transform": `${host}/vault/get_single_item_history` // transform GET
            }
          },
          {
            name: "Vault Items (Latest)",
            urls: {
              "auth": `${host}/vault/authenticate`,
              "list": `${host}/vault/get_item_list`, // list source GET
              "transform": `${host}/vault/get_single_item_latest` // transform GET
            }
          },
          {
            name: "Vault Files",
            urls: {
              "auth": `${host}/vault/authenticate`,
              "list": `${host}/vault/get_file_list`, // list source GET
              "transform": `${host}/vault/get_single_file` // transform GET
            }
          }

        ],
        deepLynxURLs: null,
        transformURL: null
      }

    }
  }
</script>

<style scoped>
.selector {
  max-width: 50%;
}
</style>
