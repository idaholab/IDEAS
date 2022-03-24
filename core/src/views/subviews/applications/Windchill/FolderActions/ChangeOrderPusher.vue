<template>
  <span>
    <v-btn @click="open_doc_modal()">Change requests</v-btn>
    <ModalForm @submit="change_check" class="appBarModal" v-show="isDocModalVisible" @close="close_doc_modal">
      <template v-slot:header>
        Change Requests
      </template>

      <template v-slot:body>
        <LocalMessage :message="message" :messageClass="messageClass" />
        <center>
          <template v-if="!requests_searched">
            Searching for available change requests...
          </template>
          <template v-else>
            Filter to current folder <input type="checkbox" v-model="filter_to_folder" v-on:change="update_filter"/>
            <v-select
              v-model="selected_request"
              :items="requests"
              item-text="Number"
              item-value="ID"
              label="Change Requests"
              @change="select_request"
            >
            </v-select>

            <v-expansion-panels>
              <v-expansion-panel
                v-for="obj in affected_objects"
                :key="obj.Identity"
              >
                <v-expansion-panel-header>
                  {{ obj.Number }} | {{ obj.ObjectType }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <table>
                    <tr>
                      <th class="table-light">
                        Property
                      </th>
                      <th class="table-light">
                        Value
                      </th>
                    </tr>
                    <tr v-for="(item, key, index) in obj" :key="key">
                      <td :class="{'table-light': index % 2}" >
                        {{ key }}
                      </td>
                      <td :class="{'table-light': index % 2}">
                        {{ item }}
                      </td>
                    </tr>
                  </table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </center>
        <br>
      </template>
    </ModalForm>
  </span>
</template>

<script>
import axios from 'axios'

import store from '@/store/index.js'

import ModalForm from '@/../components/modal/ModalForm'
import LocalMessage from '@/../components/status/LocalMessage'

export default {
  name: 'ChangeOrderPusher',
  components: {
    ModalForm,
    LocalMessage
  },
  props: {
    containerId: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      required: true,
    },
    folderName: {
      type: String,
      required: true,
    },
    authString: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isDocModalVisible: false,
    message: '',
    messageClass: '',
    requests: [],
    requests_searched: false,
    filter_to_folder: false,
    selected_request: null,
    affected_objects: []
  }),
  methods: {
    get_deep_lynx_readiness() {
      if (!store.getters.deep_lynx_health) {
        this.message = "Deep Lynx is unreachable now. Please try again later"
        this.messageClass = "message_error"
        return false
      } else if (!store.getters.deep_lynx_token) {
        this.message = "Please authenticate into Deep Lynx"
        this.messageClass = "message_error"
        return false
      } else if (!store.getters.deep_lynx_container) {
        this.message = "Please select a Deep Lynx container"
        this.messageClass = "message_error"
        return false
      } else if (!store.getters.deep_lynx_datasource) {
        this.message = "Please select a Deep Lynx datasource"
        this.messageClass = "message_error"
        return false
      } else {
        this.message = ''
        this.messageClass = ''
        return true
      }
    },
    async open_doc_modal() {
      this.isDocModalVisible = true
      if(this.get_deep_lynx_readiness()) {
        let req_response = await this.get_change_requests();
        if (req_response) {
          this.requests = req_response.data;
        }
      }
    },
    async update_filter() {
      this.requests_searched = false
      let req_response = await this.get_change_requests();
      if (req_response) {
        this.requests = req_response.data;
      }
      this.requests_searched = true
    },
    close_doc_modal() {
      this.requests = [],
      this.requests_searched = false,
      this.filter_to_folder = false,
      this.selected_request = null,
      this.affected_objects = []
      this.isDocModalVisible = false
    },
    async get_change_requests() {
      let folder_filter = ''
      if (this.filter_to_folder) {
        folder_filter = this.folderName
      }
      let response  = await axios.post(
        `/api/adapters/windchill/change_requests`,
        {"folder_name": folder_filter},
        {'headers': {'Authorization': `Basic ${this.authString}`}}
      ).then(response => {
        return response
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
        return false;
      });

      this.requests_searched = true;

      return response;
    },
    async get_affected_objects(cr_ident) {
      let response  = await axios.get(
        `/api/adapters/windchill/affect_links/${cr_ident}`,
        {'headers': {'Authorization': `Basic ${this.authString}`}}
      ).then(response => {
        return response
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
        return false;
      });

      return response;
    },
    clean_affected_obj(temp_obj) {
      let new_obj = {}
      for (const property in temp_obj) {
        if(temp_obj[property]) {
          new_obj[property] = temp_obj[property]
        } else {
          new_obj[property] = "null"
        }
      }
      return new_obj;
    },
    async select_request(event) {
      this.affected_objects = []
      let temp_objs = []
      let links_response = await this.get_affected_objects(event)
      for (var i=0; i < links_response.data.length; i++) {
        if ("AffectedObjects" in links_response.data[i]) {
          for (var j=0; j < links_response.data[i]["AffectedObjects"].length; j++) {
            let temp_obj = this.clean_affected_obj(links_response.data[i]["AffectedObjects"][j])
            temp_objs.push(temp_obj)
          }
        }
      }
      this.affected_objects = temp_objs
    },
    change_check() {
      alert("Change request selected")
    }
  }
}
</script>

<style scoped>
.button_form {
  gap: 1rem;
}

.doc_num_table td {
  padding: 0.25rem;
}

input {
  background-color: white;
  border-radius: 4px;
  padding-left: 0.25rem;
  width: 4em;
}

.first_cell {
  text-align: right;
}

.table-light {
  background-color: #121212;
}

th, td {
  padding: 0.5rem !important;
  text-align: center !important;
  border-radius: 4px !important;
}
</style>
