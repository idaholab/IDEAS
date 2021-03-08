Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
  <div>
    <table>
      <th>Data</th>
      <th>ID</th>
      <tr v-for="object in objects" :key="object.id">
        <td>
          {{ object.name }}
        </td>
        <td>
          {{ object.id }}
        </td>
        <td>
          <v-btn
            v-if="deepLynxURLs"
            v-on:click="push(object, deepLynxURLs)"
            >Push</v-btn
          >
        </td>
      </tr>
    </table>
  </div>
</template>



<script>
const axios = require('axios');
export default {
    name: 'Objects',
    props: {
        objects: Array,
        transformURL: String,
        deepLynxURLs: Object
    },
    methods: {
        async push(obj, dlURLs) {
            let dlURL = dlURLs["json"];
            if ('is_file' in obj) {
                if (obj.is_file) {
                  dlURL = dlURLs["file"];
                }
            }
            let data = await axios.get(`${this.transformURL}/${obj.id}`).then(response => {
                return [response.data];
            });
            await axios.post(dlURL, data)
        }
    },
    data: () => ({
    }),
    mounted: function () {
    }
}
</script>

<style scoped>
table {
  margin: 0 auto;
}
th {
  text-align: left;
}
td {
  vertical-align: middle;
  min-width: 5rem;
}
</style>
