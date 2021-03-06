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
            v-if="deepLynxURL"
            v-on:click="push(object.id, deepLynxURL)"
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
        deepLynxURL: String
    },
    methods: {
        async push(obj_id, dlURL) {
            let data = await axios.get(`${this.transformURL}/${obj_id}`).then(response => {
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
