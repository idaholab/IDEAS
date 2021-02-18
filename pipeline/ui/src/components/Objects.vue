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
            v-if="url && container && data_source"
            v-on:click="push(object.id, url, container, data_source)"
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
        url: String,
        token: String,
        container: String,
        data_source: String
    },
    methods: {
        async push(projId, url, container, data_source) {

            let data = await axios.get(`${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/innoslate/non-document-data/${projId}`).then(response => {
                return [response.data];
            });
            this.clicked.push(projId);

            const headers = {Authorization: `Bearer ${this.token}`};
            await axios.post(`${url}/containers/${container}/import/datasources/${data_source}/imports`, data, {headers: headers})
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