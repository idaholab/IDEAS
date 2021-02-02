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

      <div class="selector">
        <v-select 
        :items="destinations" 
        item-text="name"
        item-value="url"
        label="Destination"
        v-on:change="setURL"
        placeholder="Destination"
        class="select">
        </v-select>
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
const axios = require('axios');

  export default {
    name: 'Selector',
    components: {
      Objects
    },
    methods: {
      async getObjects(url) {
        this.objects = await axios.get(url).then(response => {
          return response.data.projects;
        });
      },
      setURL(url) {
        this.url = url
      }
    },
    data: () => ({
      objects: null,
      sources: [
        {name: "Innoslate", url: "http://localhost:3001/innoslate/"}
      ],
      destinations: [
        {name: "deep-lynx", url: "/deep-lynx"},
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