Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>

<div>

  <div v-if="files.length" class="selector">
    <v-select
      :items="files"
      item-text="name"
      item-value="id"
      label="Deep Lynx Files"
      v-on:change="setFile"
      placeholder="Deep Lynx File"
      class="select">
    </v-select>
  </div>

</div>


</template>

<script>
const axios = require('axios');

  export default {
    name: 'DeepLynxFiles',
    components: {
    },
    props: {
      container_id: String,
      token: String
    },
    methods: {
      setURL(url) {
        this.url = url
      },
      async getFiles() {
        await axios.get(`${this.url}/deeplynx/get_files/${this.container_id}/${this.token}`).then(response => {
          console.log(response.data)
          for(var i=0;i<response.data.files.length;i++) {
            let id = response.data.files[i].id;
            let name = response.data.files[i].file_name;
            let date = response.data.files[i].created_at.replace('GMT+0000 (Coordinated Universal Time)', '');
            this.files.push({
              "id": id,
              "name": name + " | " + date
            });
          }
        }).catch(error => {
          this.error_message = error;
        });
      },
      setFile(ident) {
        this.$emit('fileSet', ident);
      }
    },
    data: () => ({
      error_message: null,
      url: null,
      files: []
    }),
    mounted: function() {
      this.setURL(`http://${process.env.VUE_APP_UI_HOST}:${process.env.VUE_APP_SERVER_PORT}`);
      this.getFiles();
    }
  }
</script>

<style scoped>
  .selector {
    max-width: 50%;  
  }
</style>
