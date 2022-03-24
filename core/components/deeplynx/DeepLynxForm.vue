<template>
  <table class="dl_input_form">
    <tr v-for="key in metatype.keys" :key="key.id">
      <template v-if="!(excluded_fields.includes(key.name))">
        <td class="key_name">{{ key.name }}</td>
        <td>:</td>
        <td>
          <!-- regular single-value properties -->
          <input
            v-if="!key.options"
            v-model="$data['form_data'][key.name]"
            class="def_input"
            :name="key.name"
            :type="typehash[key.data_type]"

            size="36"
          />

          <!-- properties w an enumeration -->
          <v-select
            v-else-if="!(excluded_fields.includes(key.name))"
            v-model="$data['form_data'][key.name]"
            :items="key.options"
            :label="key.name"
            :placeholder="key.name"
            class="select"
            color="#4ebf94">
          </v-select>
        </td>
        <td></td>
      </template>
    </tr>

    <!-- metatypes that can be connected via edge -->
    <tr v-for="(obj, key) in connected_metatype_lists" :key="key">
      <td class="key_name">{{ key }}</td>
      <td>:</td>
      <td>
        <v-select
          v-model="$data['form_data'][key]"
          :items="obj.nodes"
          item-text="name"
          item-value="id"
          :label="key"
          :placeholder="key"
          class="select"
          color="#4ebf94"
          :multiple="obj.multiple"
          @input="emitSelection({id: $data['form_data'][key], name: obj.name})"
        >
        </v-select>
      </td>
      <td></td>
    </tr>

    <template v-for="(plist, pgroup) in parameter_groups" >
      <tr :key="pgroup">
        <td colspan="3" class="parameter_group_name">
          <center>{{ pgroup }}</center>
        </td>
      </tr>
      <tr v-for="param in parameter_groups[pgroup]" v-bind:key="param.name">
        <td class="key_name">{{ param.name }}</td>
        <td>:</td>
        <td>
          <template v-if="param.time_entry">
            <v-file-input accept=".csv" label="File input" @change="attachProfile($event, param.name, param.id)"/>
            <div :id="param.name"></div>
            <center><v-btn @click="downloadTemplate(param.name, param.type)" elevation="2">Get template</v-btn></center>
          </template>
          <template v-else>
            <input
              v-model="params[param.id]"
              class="def_input"
              :name="param.id"
              :type="typehash[param.type]"
              size="36"
            />
          </template>
        </td>
        <td>
          {{ param.unit_abbrev }}
        </td>
      </tr>
    </template>

    <tr v-if="file_upload">
      <td class="key_name">file</td>
      <td>:</td>
      <td>
        <v-file-input v-model="dl_file" accept=".stl" label="File input"/>
      </td>
    </tr>
  </table>
</template>

<script>
import axios from 'axios'
import uuid from 'uuid-random'
import store from '@/store/index.js'

export default {
  name: 'DeepLynxForm',
  props: {
    metatype_name: {
      type: String,
      required: true
    },
    connected_metatypes: {
      type: Array,
      default() {
        return []
        //[{
        //  "selector_name": "Selector Name"
        //  "metatype_name": "MetatypeName",
        //  "multiple": true
        //}]
      },
      required: false
    },
    parameter_groups: {
      type: Object,
      default() {
        return {}
        //{"group_one":
        //[{
        //  "name": "V",
        //  "id": "1111-aaaa-1111-aaaa",
        //  "type": 'string'
        //}]
        //}
      },
      required: false
    },
    excluded_fields: {
      type: Array,
      default() {
        return []
      },
      required: false
    },
    file_upload: {
      type: Boolean,
      default() {
        return false
      },
      required: false
    }
  },
  components: {
  },
  data: () => ({
    message: '',
    messageClass: '',
    isModalVisible: false,
    metatype: {
      id: "0",
      name: "Loading metatype...",
      description: "",
      keys: [
        {
          'id': 'ID',
          'name': 'Loading...',
          'data_type': 'string',
          'default_value': 'Loading...'}
      ]
    },
    typehash: {
      "number": "number",
      "number64": "number",
      "float": "number",
      "float64": "number",
      "date": "date",
      "string": "text",
      "boolean": "checkbox",
      "enumeration": "enumeration",
      "file": "string"

    },
    connected_metatype_lists: {},
    form_data: {},
    params: {},
    dl_file: null
  }),
  methods: {
    async get_metatype_definition() {
      let response = await axios.get(
        `/api/apps/deeplynx/get_metatype_definition/${store.getters.deep_lynx_container}/${this.metatype_name}/${store.getters.deep_lynx_token}`
      )

      let definition = response.data[0]["metatype_definition"]

      definition.keys = this.filterKeys(definition)

      return definition;
    },
    filterKeys(definition) {
      let new_keys = [];
      definition.keys.forEach(key => {
        if (key.name == "id") {
          this.$forceUpdate(this.form_data["id"] = uuid())
        } else if ('default_value' in key) {
          this.form_data[key.name] = key.default_value
        }
        new_keys.push(key)
      });

      // order id first, name second, description third, if they exist
      ["description", "name", "id"].forEach(keyname => {
        new_keys.sort(function(x, y) {
          return x.name == keyname ? -1 : y == keyname ? 1 : 0
        });
      })

      return new_keys;

    },
    async get_nodes(metatype_name) {
      let response = await axios.get(
        `/api/apps/deeplynx/get_nodes/${metatype_name}/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_token}`
      )
      return await this.restructureNodes(response.data[0].data.nodes)
    },
    restructureNodes(nodes) {
      let temp_nodes = [];
      nodes.forEach(node => {
        let temp_obj = {}
        node.properties.forEach(property => {
          temp_obj[property.key] = property.value
        })
        temp_nodes.push(temp_obj)
      })
      return temp_nodes;
    },
    cleanId(ident) {
      if (ident) {
        return ident.replaceAll('"', '')
      } else {
        return ident
      }
    },
    async compileForm() {
      this.form_data = {}
      this.params = {}
      if (this.connected_metatypes != []) {
        for (var i=0; i < this.connected_metatypes.length; i++) {
          let nodes = await this.get_nodes(this.connected_metatypes[i].metatype_name)
          let temp_obj = {
            "name": this.connected_metatypes[i].metatype_name,
            "nodes": nodes,
            "multiple": this.connected_metatypes[i].multiple
          }
          this.connected_metatype_lists[this.connected_metatypes[i].selector_name] = temp_obj
        }
      }
      this.metatype = await this.get_metatype_definition()
      return true;
    },
    cleanForm() {
      for (var i=0; i < this.connected_metatypes.length; i++) {
        let mt = this.connected_metatypes[i].selector_name
        if (mt in this.form_data) {
          if (this.connected_metatypes[i].multiple) {
            for (var j=0; j < this.form_data[mt].length; j++) {
              this.form_data[mt][j] = {"id" : this.cleanId(this.form_data[mt][j])}
            }
          } else {
            this.form_data[mt] = this.cleanId(this.form_data[mt])
          }
        }
      }
    },
    downloadTemplate(name, type) {
      let typehash = {
        "number": ["1.1","2.4","5.8"],
        "boolean": ["true","false","true"],
        "string": ["string one","string two","string three"]
      }
      let first_stamp = new Date(Date.now() - 120000)
      let second_stamp = new Date(Date.now() - 60000)
      let third_stamp = new Date(Date.now())

      let temp_string = `timestamp,value\r\n`
      temp_string += `${first_stamp.toISOString()},${typehash[type][0]}\r\n`
      temp_string += `${second_stamp.toISOString()},${typehash[type][1]}\r\n`
      temp_string += `${third_stamp.toISOString()},${typehash[type][2]}`

      let filename = name.replaceAll(" ", "") + ".csv"
      let blob = new Blob([temp_string], { type: 'text/csv;charset=utf-8;' })
      let link = document.createElement("a")
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    attachProfile(event, param_name, param_id) {
      this.getCSV(event).then( response => {
        let el = document.getElementById(param_name)
        el.innerHTML = JSON.stringify(response)
        this.params[param_id] = response
      })
    },
    getCSV(event) {
      var reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onload = function() {
          var csv = reader.result
          var lines = csv.split("\r\n")
          var result = [];
          var headers=lines[0].split(",");
          for(var i=1;i<lines.length;i++){
            var obj = {};
            var currentline=lines[i].split(",");
            for(var j=0;j<headers.length;j++){
              if(currentline[j]!='' && currentline[j]!=undefined) {
                obj[headers[j]] = currentline[j];
              }
            }
            if(Object.keys(obj).length > 0) {
              result.push(obj);
            }
          }
          resolve(result)
        }
        reader.onerror = function() {
          reject('The file failed to load.')
        }
        reader.readAsText(event)
      })
    },
    emitSelection(event) {
      this.$emit('itemselected', event)
    },
    emitMessage(message, messageClass) {
        this.$emit(
          'message',
          { 'message': message, 'messageClass': messageClass }
        )
    },
    getFile() {
      if (!this.dl_file || this.file_upload != true) {
        this.emitMessage("You must choose a file to submit this metatype.", "message_error")
        return false
      }
      return this.dl_file;
    },
    async getForm() {
      await this.cleanForm()
      return this.form_data
    },
    async getParams() {
      return this.params
    }
  },
  computed: {
  },
  mounted: function() {
    this.compileForm()
  },
  created: function() {
    this.compileForm()
  }
}
</script>

<style>
.key_name {
  text-align: right;
}

.def_input {
  background-color: white !important;
  border-radius: 4px;
  width: 100%;
}
.dl_input_form td {
  padding: 0.25rem;
}
.dl_file_input {

}
.parameter_group_name {
  color: white !important;
}
</style>
