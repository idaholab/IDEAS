<template>
  <span>
    <v-btn @click="open_doc_modal()">Allocate doc #s at {{ folderName }}</v-btn>
    <ModalForm @submit="document_push" class="appBarModal" v-show="isDocModalVisible" @close="close_doc_modal">
      <template v-slot:header>
        Populate Documents
      </template>

      <template v-slot:body>
        <LocalMessage :message="message" :messageClass="messageClass" />
        <center>
          <template v-if="!docs_searched">
            Searching for available document numbers...
          </template>
          <template v-else>
            <table class="doc_num_table">
              <tr>
                <td class="first_cell">Available document numbers</td>
                <td>:</td>
                <td>
                  {{ available_docs.length }}
                </td>
              </tr>
              <tr>
                <td class="first_cell">Number of documents to allocate</td>
                <td>:</td>
                <td>
                  <input type="number" min="0" v-model="user_docs_requested" size="5" />
                </td>
              </tr>
            </table>
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
  name: 'DocumentAllocator',
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
    available_docs: [],
    allocated_docs: [],
    docs_searched: false,
    user_docs_requested: 0
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
    open_doc_modal() {
      this.isDocModalVisible = true
      if(this.get_deep_lynx_readiness()) {
        this.get_available_docs()
      }
    },
    close_doc_modal() {
      this.isDocModalVisible = false
    },
    filter_doc_response_data(response_data) {
      response_data[0].data.nodes.forEach(node => {
        this.available_docs.push(JSON.parse(node.raw_properties))
      });
      return true;
    },
    async get_available_docs() {
      this.available_docs = []
      let query = `
        {
            nodes(
                where: {AND: [
                    { metatype_name: "eq DocumentStatusChangeRecord"}
                    {properties: { key: "status", value: "available", operator: "eq" }}
                ]}
            ) {
                raw_properties
            }
        }`
      let response = await axios.post(
        `/api/apps/deeplynx/query/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_token}`,
        {"query": query}
      ).then(async response => {
        await this.filter_doc_response_data(response.data)
        this.docs_searched = true
        return true;
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
        this.docs_searched = true
        return false
      });

      return response;

    },
    allocate_docs() {
      for (var i=0; i < this.user_docs_requested; i++) {
        let doc = this.available_docs.shift()
        this.allocated_docs.push(doc)
      }
      return true;
    },
    async generate_windchill_document_list() {
      let doc_list = []
      for (var i=0; i < this.user_docs_requested; i++) {
        let temp_doc = {
          'Title': "Replace Title",
          'Number': this.allocated_docs[i].document_number,
          'Description': "Replace Description",
          'Name': this.allocated_docs[i].document_number,
          'Context@odata.bind': `Containers('${this.containerId}')`,
          'Folder@odata.bind': `Folders('${this.folderId}')`,
          'Thumbnails@odata.bind': [],
          'SmallThumbnails@odata.bind': [],
          'Attachments@odata.bind': []
        }
        doc_list.push(temp_doc)
      }
      let doc_body = {'Documents': doc_list};

      return doc_body;
    },
    async change_doc_status() {
      let now = new Date()

      this.allocated_docs.forEach(doc => {
        doc.modified_date = now.toISOString()
        doc.status = "allocated"
        doc.status_date = now.toISOString()
      });

      let response = await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{
          "DocumentStatusChangeRecord": this.allocated_docs
        }]
      ).then(response => {
        this.message = `The push to Deep Lynx was successful with response code ${response.status}`
        this.messageClass = "message_success"
        return true;
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
        return false;
      });

      return response;
    },
    async send_docs_to_windchill(doc_request_body) {
      let nonce = await axios.get(
        `/api/adapters/windchill/get_nonce`,
        {'headers': {'Authorization': `Basic ${this.authString}`}}
      ).then(response => {
        return response.data.NonceValue;
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
        return false;
      });

      let passed = await axios.post(
        `/api/adapters/windchill/create_documents`,
        doc_request_body,
        {'headers':
          {
            'Authorization': `Basic ${this.authString}`,
            'csrfnonce': nonce,
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        store.commit('set_message_text', `Successfully sent ${this.user_docs_requested} documents to Windchill with status ${response.status}`)
        store.commit('set_message_type', "message_success")
        return true;
      }).catch(error => {
        store.commit('set_message_text', error.message)
        store.commit('set_message_type', "message_error")
        return false;
      });

      this.close_doc_modal()
      return passed
    },
    async document_push() {
      if (await this.get_available_docs()) {
        if (this.user_docs_requested > this.available_docs.length) {
          this.message = "The number of documents requested cannot exceed the number of documents available"
          this.messageClass = "message_error"
          return false;
        } else if (this.user_docs_requested <= 0) {
          this.message = "You must request a number of documents greater than zero."
          this.messageClass = "message_error"
          return false;
        } else {
          await this.allocate_docs()
          let doc_request_body = await this.generate_windchill_document_list()
          if (await this.send_docs_to_windchill(doc_request_body)) {
            await this.change_doc_status()
          }
        }
      } else {
        this.close_doc_modal()
        store.commit('set_message_text', "Could not get available documents")
        store.commit('set_message_type', "message_error")
      }
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
</style>
