<template>
  <v-container>
        <v-select
        return-object
          :items="data"
          item-text="name"
          item-value="id"
          label="Projects"
          placeholder="Project"
          v-on:change="select">
        </v-select>

        <template v-if="project">
          <span><h3>{{project.name}}</h3></span>
          <span v-html="project.description">{{project.description}}</span>



          <template>
            <v-text-field 
            ref="input"
            type="text" 
            v-model="fileName" 
            placeholder="Filename" 
            :rules="[rules.validate]"></v-text-field>
            <span v-if="error" style="color:red;">{{error}}</span>
            <br />
            <v-btn v-on:click="generate">Generate</v-btn>
          </template>
        </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import FileSaver from 'file-saver';

  export default {
    name: 'Generator',
    data: () => ({
      data: [],
      project: null,
      fileName: "",
      error: null,
      rules: {
        validate: (fileName) => {
          let regex = new RegExp(/[',.?":{}|<>/\\/]/g);
          return regex.test(fileName) ? "No special characters or file extensions" : true
        }
      }
          
    }),
    methods: {
      async getProjects() {
        this.data = await axios.get('http://localhost:5000/innoslate/projects').then(response => {
          return response.data;
        })
      },
      async select(project) {
        this.error = null;
        this.project = project;
      },
      async generate() {
        if(this.fileName.trim().length == 0) {
            alert("Enter a filename");
            return
        }
        if (this.$refs.input.validate()) {
          await axios.post(`http://localhost:5000/entities/${this.project.id}`, {fileName: this.fileName}, {responseType: 'blob'} ).then(response => {
            
            FileSaver.saveAs(response.data, this.fileName);

          }).catch(error => {
            if(error.response.status == 404) {
              this.error = "This project has no risk entities";
              console.log(this.error);
            } else {
              console.log(error)
            }
          })
        }
      }
    },
    mounted: async function() {
      await this.getProjects();
    }
  }
</script>
