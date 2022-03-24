Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
  <div id="file_tracer">
    <h2 class="filectracer_title">File Tracer</h2><br>
    <v-container>
      <v-row>

        <br><br>
      </v-row>
      <v-row>
        <v-col cols="3">
          <Card cardTitle="Assets">
            <DeepLynx @assetSet="setAssetId" @containerSet="setContainerId" @tokenSet="setDLToken"/><br><br>
            <div v-if="drawing_ids.length">
              <span style="font-size:75%;">
                Drawing IDs
              </span><br>
              <ul style="font-size:75%;">
                <li v-for="idx in drawing_ids" v-bind:key="idx">{{ idx }}</li>
              </ul><br><br>
              <v-btn v-if="drawing_ids.length && selected_asset_id" v-on:click="createTrace()">Create Trace</v-btn>
            </div>
          </Card>
        </v-col>
        <v-col cols="9">
          <Card cardTitle="Drawing">
            <template v-if="file_obj">
              <Canvas v-bind:file_obj="file_obj" :max_width="800" @clicked="handleID" @unclicked="popID" @clearCanvas="clearCanvas"/>
            </template>
            <template v-else>
              <DeepLynxFiles v-if="selected_container_id" :container_id="selected_container_id" :token="dl_token" @fileSet="getFile"/>
              <span v-else>Select a DeepLynx container.</span>
            </template>
          </Card>
        </v-col>
      </v-row>
    </v-container>

  </div>

</template>

<script>
const axios = require('axios');
import Canvas from './FileTracer/Canvas.vue';
import DeepLynx from '@/../components/deeplynx/DeepLynx.vue';
import DeepLynxFiles from '@/../components/deeplynx/DeepLynxFiles.vue';
import Card from '@/../components/card/Card.vue';

export default {
  name: 'File Tracer',
  components: {
    Canvas,
    DeepLynx,
    DeepLynxFiles,
    Card
  },
  methods: {
    async getFileData() {

      await axios.get('/api/apps/filetracer/libredwg/file_string').then(dwg_string => {

        this.file_string = dwg_string.data;
        axios.post(
          '/api/apps/filetracer/libredwg/file_obj',
          {'file_string': dwg_string.data}
        ).then(dwg_obj => {
          this.file_obj = dwg_obj.data;
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
      return;
    },
    handleID(idx) {
      if (this.drawing_ids.includes(idx)) {
        let index = this.drawing_ids.indexOf(idx);
        this.drawing_ids.splice(index, 1);
        document.getElementById(idx).style="stroke:black;";
      } else {
        this.drawing_ids.push(idx);
        document.getElementById(idx).style="stroke:blue;";
      }
      //this.setColor();
    },
    popID(idx) {
      let index = this.drawing_ids.indexOf(idx);
      if (index !== -1) {
        this.drawing_ids.splice(index, 1);
      }
    },
    setAssetId(idx) {
      this.selected_asset_id = idx;
      this.getAssetTraces();
    },
    setContainerId(idx) {
      this.selected_container_id = idx;
    },
    async getFile(idx) {
      this.selected_file_id = idx;
      await axios.get(
        `/api/apps/filetracer/deeplynx/download_file/${this.selected_container_id}/${idx}/${this.dl_token}`
      ).then(dwg_string => {
        this.file_string = dwg_string.data;
        axios.post(
          '/api/apps/filetracer/libredwg/file_obj',
          {'file_string': dwg_string.data}
        ).then(dwg_obj => {
          this.file_obj = dwg_obj.data;
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
    },
    setDLToken(token) {
      this.dl_token = token;
    },
    clearCanvas() {
      this.drawing_ids.forEach((idx) => {
        document.getElementById(idx).style="stroke:black;";
      });
      this.defined_ids.forEach((idx) => {
        document.getElementById(idx).style="stroke:black;";
      });
      this.drawing_ids = [];
      this.defined_ids = [];
      this.selected_asset_traces = [];
    },
    async getAssetTraces() {
      this.clearCanvas();
      this.defined_ids = [];
      this.selected_asset_traces = await axios.get(`/api/apps/filetracer/appdatabase/get_asset_elements/${this.selected_asset_id}/${this.selected_file_id}`);
      this.defined_ids = this.selected_asset_traces.data.asset_elements.map(el => el.elementIndex);
      this.defined_ids.forEach((idx) => {
        document.getElementById(idx).style="stroke:green;";
      });
    },
    async createTrace() {
      let asset = await axios.get(`/api/apps/filetracer/appdatabase/add_asset/${this.selected_asset_id}`);
      let file_element = null;
      let element_trace = null;
      for (const idx in this.drawing_ids) {
        file_element = await axios.get(`/api/apps/filetracer/appdatabase/add_file_element/${this.selected_file_id}/${this.drawing_ids[idx]}`);
        element_trace = await axios.get(`/api/apps/filetracer/appdatabase/add_element_trace/${asset.data.asset.id}/${file_element.data.file_element.id}`);
        console.log(element_trace.data.element_trace.id);
      }
      this.clearCanvas();
      this.getAssetTraces();
    }
  },
  data: () => ({
    file_obj: null,
    drawing_ids: [],
    defined_ids: [],
    selected_asset_id: null,
    selected_container_id: null,
    selected_file_id: null,
    selected_asset_traces: [],
    dl_token: null
  }),
  mounted: function() {
    //this.getFileData()
  }

};
</script>

<style>
#file_tracer {
  background-color: #121212;
}
.filectracer_title {
  font-weight: 100;
}
div.v-select__selections {
  color: #ffffff !important;
}
label {
  color: #4ebf94 !important;
}
h1 {
  size: 1.25rem;
  weight: 300;
  line-height: 1;
  letter-spacing: normal;
}
h2 {
  size: 1.625rem;
  weight: 400;
  line-height: 1.35;
  letter-spacing: normal;
}
h3 {
  size: 1.15rem;
  weight: 400;
  line-height: 48px;
  letter-spacing: normal;
}
h4 {
  size: 1rem;
  weight: 500;
  line-height: 40px;
  letter-spacing: 0.025rem;
}
h5 {
  size: 0.875rem;
  weight: 400;
  line-height: 32px;
  letter-spacing: normal;
}
h6 {
  size: 0.75rem;
  weight: 500;
  line-height: 1.25;
  letter-spacing: normal;
}
</style>
