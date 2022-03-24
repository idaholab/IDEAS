<template>
  <Card icon="mdi-file-word-outline" cardTitle="Parse files">
    <table>
      <tr>
        <td>Select a .docx file to parse.</td>
      </tr>
      <tr>
        <td colspan="2"><v-file-input v-model="doe_file" accept=".docx" label="File input"/></td>
      </tr>
      <tr v-if="doe_file">
        <td><v-btn @click="parseFile('csv')">Download CSV</v-btn></td>
        <td><v-btn @click="parseFile('obj')">Get file as object</v-btn></td>
      </tr>
      <tr v-if="object_response">
        <td colspan="2">
          {{ object_response }}
        </td>
      </tr>
    </table>
  </Card>
</template>

<script>
import axios from 'axios'
import store from '@/store/index.js'
import Card from '@/../components/card/Card.vue'
export default {
  name: 'ParserUpload',
  data: () => ({
    doe_file: null,
    object_response: null
  }),
  components: {
    Card
  },
  methods: {
    async parseFile(extension) {
      let formData = new FormData()
      formData.append('file', this.doe_file)
      await axios.post(
        `/api/apps/doe-parser/convert/${extension}`,
        formData,
        {headers: {'Content-Type': `multipart/form-data`, 'Access-Control-Allow-Origin': '*'}}
      ).then(response => {
        if (extension == 'csv') {
          let filename = "test.csv"
          let link = document.createElement("a")
          let blob = new Blob([response.data], {type: "data:text/csv;charset=utf-8"})
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (extension == 'obj') {
          this.object_response = response.data
        }
      }).catch(error => {
        store.commit('set_message_text', `${error.message}`)
        store.commit('set_message_type', "message_error")
      })
    }
  },
  computed: {
  },
  mounted: function() {
  }
}
</script>

<style scoped>

</style>
