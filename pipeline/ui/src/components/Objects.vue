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

            let data = await axios.get(`http://localhost:3001/innoslate/${proj}`).then(response => {
                return [response.data];
            });
            this.clicked.push(proj);

            console.log(data);
            // const token = "TOKEN";
            // const container = "CONTAINER";
            // const source = "SOURCE";
            
            // let headers = {Authorization: `Bearer ${token}`};
            // await axios.post(`http://localhost:8090/containers/${container}/import/datasources/${source}/imports`, data, {headers: headers})
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