Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>

<div>
  Deep Lynx Access:
  <span v-if="deepLynxOpen" style="color:green;">Open</span>
  <span v-else style="color:red;">Not found</span>

  <div v-if="deepLynxOpen">
    <v-btn v-on:click="authenticate()">Authenticate</v-btn>
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
        axios.get('http://localhost:3131/deeplynx/get_token').then(response => {
            if (response.data.token) {
              this.token = response.data.token;
              alert(this.token);
            } else {
              this.error_message = "Token not retrieved from Deep Lynx";
            }
        }).catch(error => {
          this.error_message = error;
        });
      }
    },
    data: () => ({
      error_message: null,
      url: null,
      deepLynxOpen: false,
      token: null
    }),
    mounted: function() {
      axios.get('http://localhost:3131/deeplynx/health').then(response => {
          if (response.data=='OK') {
            this.deepLynxOpen = true;
          }
      }).catch(error => {
        this.error_message = error;
      });
    }
  }
</script>

<style scoped>

</style>
