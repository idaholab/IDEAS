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
            v-if="url"
            v-on:click="push(object.id, url)"
            :disabled="clicked.includes(object.id)"
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
        url: String
    },
    methods: {
        async push(proj) {

            let data = await axios.get(`${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/innoslate/non-document-data/${proj}`).then(response => {
                return [response.data];
            });

            this.clicked.push(proj);

            const token = "test" //process.env.VUE_APP_DEEP_LYNX_TOKEN;
            const container = "test" //process.env.VUE_APP_DEEP_LYNX_CONTAINER;
            const source = "test" //process.env.VUE_APP_DEEP_LYNX_DATASOURCE;

            const headers = {Authorization: `Bearer ${token}`};

            await axios.post(`${process.env.VUE_APP_DEEP_LYNX_ADDRESS}/containers/${container}/import/datasources/${source}/imports`, data, {headers: headers})
        }
    },
    data: () => ({
        clicked: []
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
