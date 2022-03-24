<template>
  <span>
    <v-btn @click="showModal()">List</v-btn>
    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        {{ metatype_name }}s
      </template>
      <template v-slot:body>
        <LocalMessage :message="message" :messageClass="messageClass" />
        <center>
          <table>
            <tr>
              <th class="table-light" v-for="key in metatype.keys" :key="key.name">
                {{ key.name }}
              </th>
            </tr>
            <tr v-for="(node, index) in nodes" :key="node.id">
              <td :class="{'table-light': index % 2}" v-for="key in metatype.keys" :key="key.name">
                {{ node[key.property_name] }}
              </td>
            </tr>
          </table>
        </center>
        <br>
      </template>
    </Modal>
  </span>
</template>

<script>
import axios from 'axios'
import store from '@/store/index.js'
import Modal from '@/../components/modal/Modal.vue'
import LocalMessage from '@/../components/status/LocalMessage.vue'
export default {
  name: 'DeepLynxList',
  props: {
    metatype_name: {
      type: String,
      required: true
    }
  },
  components: {
    Modal,
    LocalMessage
  },
  data: () => ({
    message: '',
    messageClass: '',
    isModalVisible: false,
    metatype: {
      id: "0",
      name: "Loading metatype...",
      description: "",
      keys: []
    },
    nodes: [{
      id: "0",
      name: "Loading nodes...",
      description: ""
    }]
  }),
  methods: {
    async get_deeplynx_readiness() {
      if (store.getters.deep_lynx_health == null) {
        this.message = "The Deep Lynx service is unavailable. Check your connection to Deep Lynx"
        this.messageClass = "message_error"
        return false;
      } else if (store.getters.deep_lynx_token == null) {
        this.message = "The Deep Lynx service has not been accessed with proper credentials. Please use the Deep Lynx form to sign in."
        this.messageClass = "message_error"
        return false;
      } else if (store.getters.deep_lynx_container == null) {
        this.message = "A Deep Lynx container has not been selected. Please use the Deep Lynx form to selected one."
        this.messageClass = "message_error"
        return false;
      } else {
        this.message = ''
        this.messageClass = ''
        return true;
      }
    },
    async get_metatype_definition() {
      let response = await axios.get(
        `/api/apps/deeplynx/get_metatype_definition/${store.getters.deep_lynx_container}/${this.metatype_name}/${store.getters.deep_lynx_token}`
      )

      let definition = response.data[0]["metatype_definition"]

      definition.keys = this.filterKeys(definition)

      return definition;
    },
    async get_nodes() {
      let response = await axios.get(
        `/api/apps/deeplynx/get_nodes/${this.metatype_name}/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_token}`
      )

      return this.restructureNodes(response.data[0].data.nodes)
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
    filterKeys(definition) {
      let new_keys = [];
      definition.keys.forEach(key => {
        if (key.property_name != "id") {
          new_keys.push(key)
        }
      });

      // order id first, name second, description third, if they exist
      ["description", "name"].forEach(keyname => {
        new_keys.sort(function(x, y) {
          return x.name == keyname ? -1 : y == keyname ? 1 : 0
        });
      })

      return new_keys;

    },
    async showModal () {
      this.isModalVisible = true
      if (await this.get_deeplynx_readiness()) {
        this.metatype = await this.get_metatype_definition()
        this.nodes = await this.get_nodes()
      }
    },
    closeModal () {
      this.isModalVisible = false
    }
  },
  computed: {
  },
  mounted: () => ({
  })
}
</script>

<style scoped>
.table-light {
  background-color: #121212;
}

th, td {
  padding: 0.5rem !important;
  text-align: center !important;
  border-radius: 4px !important;
}
</style>
