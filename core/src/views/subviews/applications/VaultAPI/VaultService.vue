<template>
  <span class="button_wrap">
    <v-btn :style="style" @click="get_functions()">{{ service }}</v-btn>&nbsp;
    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        {{ service }} Functions
      </template>
      <template v-slot:body>
        <VaultFunction
          v-for="service_function in service_functions"
          v-bind:key="service_function.func"
          :description="service_function.description"
          :service_function="service_function.func"

          :service="service"
          :service_type="service_type"
        />
      </template>
      <template v-slot:footer>
        Test Footer
      </template>
    </Modal>
  </span>
</template>

<script>
import { ADSKClient } from '@/api/adsk_api'
import Modal from '@/../components/modal/Modal.vue'
import VaultFunction from './VaultFunction.vue'
export default {
  name: 'VaultService',
  props: {
    service_type: String,
    service: String,
    color: String
  },
  components: {
    Modal,
    VaultFunction
  },
  data: () => ({
    service_functions: [],
    isModalVisible: false
  }),
  computed: {
    style() {
      return `background-color: ${this.color};`
    }
  },
  methods: {
    async get_functions () {
      this.service_functions = []

      const adsk_client = new ADSKClient()
      let service_description = await adsk_client.serviceDescribe(
        this.service_type,
        this.service
      )

      for (let func in service_description["DESCRIPTION"]) {
        this.service_functions.push({
          "description": service_description["DESCRIPTION"][func],
          "func": func
        })
      }


      this.showModal()
    },
    showModal () {
      this.isModalVisible = true
    },
    closeModal () {
      this.isModalVisible = false
    }
  }
}
</script>

<style scoped>
.v-btn {
  margin-top: 10px !important;
}
</style>
