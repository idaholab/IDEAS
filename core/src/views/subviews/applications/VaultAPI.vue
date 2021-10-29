<template>
  <div>
    <h2>Vault API</h2><br>
    <!-- {{ vault_data }} -->
    <h3>Information Services</h3>
    <VaultService v-for="service in vault_data.information_services"
      v-bind:key="service" service_type="information"
      :service="service" color="#2BA8E0"/><br><br>
    <h3>Filestore Services</h3>
    <VaultService v-for="service in vault_data.filestore_services"
      v-bind:key="service" service_type="filestore"
      :service="service" color="#CF1E4C"/><br><br>
    <h3>Standard Services</h3>
    <VaultService v-for="service in vault_data.standard_services"
      v-bind:key="service" service_type="standard"
      :service="service" color="#F68C20"/><br><br>
  </div>
</template>

<script>
//import { ADSKClient } from '../../../api/adsk_api'

//const axios = require('axios');
import VaultService from './VaultAPI/VaultService.vue'
export default {
  name: 'VaultAPI',
  data: () => ({
    vault_response: "TEST"
  }),
  components: {
    VaultService
  },
  methods: {
    async health_response () {
      // const adsk_client = new ADSKClient()
      // let response = await adsk_client.healthCheck()
      this.$store.commit('set_vault_apiStatus', "OK")
    }
    // async authenticate () {
    //
    // }
  },
  computed: {
    vault_data() {
      return this.$store.getters['vault_data']
    }
  }
}
</script>
