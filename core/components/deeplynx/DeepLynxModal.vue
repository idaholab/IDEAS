<template>
  <span>
    <v-btn @click="showModal()">Add new</v-btn>
    <ModalForm @submit="submit" v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        {{ title }}
      </template>
      <template v-slot:body>
        <LocalMessage :message="message" :messageClass="messageClass" />
        <center>
          <slot v-if="dlReady"></slot>
        </center>
        <br>
      </template>
    </ModalForm>
  </span>
</template>

<script>
// import axios from 'axios'
import store from '@/store/index.js'
import ModalForm from '@/../components/modal/ModalForm.vue'
import LocalMessage from '@/../components/status/LocalMessage.vue'
export default {
  name: 'DeepLynxList',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    messageClass: {
      type: String,
      required: false,
      default() {
        return ''
      }
    }
  },
  components: {
    ModalForm,
    LocalMessage
  },
  data: () => ({
    isModalVisible: false,
    dlReady: false
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
    submit(event) {
      this.$emit('submit', event)
    },
    async showModal () {
      this.isModalVisible = true
      this.dlReady = await this.get_deeplynx_readiness()
      this.$emit('refresh', true)
    },
    closeModal () {
      this.isModalVisible = false
    }
  }
}
</script>
