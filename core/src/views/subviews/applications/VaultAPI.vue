<template>
  <div>
    <h2 class="vaultapi_title">Vault API <VaultInfo /></h2><br><br>
    <!-- {{ vault_data }} -->
    <Card icon="mdi-information-variant" cardTitle="Information Services">
      <VaultService v-for="service in vault_data.information_services"
        v-bind:key="service.name" service_type="information"
        :service="service" color="#2BA8E0"/>
    </Card>
    <br><br>
    <Card icon="mdi-file-cabinet" cardTitle="Filestore Services">
      <VaultService v-for="service in vault_data.filestore_services"
        v-bind:key="service.name" service_type="filestore"
        :service="service" color="#4ebf94"/>
    </Card>
    <br><br>
    <Card icon="mdi-console" cardTitle="Standard Services">
      <VaultService v-for="service in vault_data.standard_services"
        v-bind:key="service.name" service_type="standard"
        :service="service" color="#8C1823"/>
    </Card>
  </div>
</template>

<script>
import VaultService from './VaultAPI/VaultService.vue'
import VaultInfo from './VaultAPI/VaultInfo.vue'
import Card from '@/../components/card/Card.vue'
export default {
  name: 'VaultAPI',
  data: () => ({
    vault_response: "TEST"
  }),
  components: {
    VaultService,
    VaultInfo,
    Card
  },
  methods: {
    async health_response () {
      this.$store.commit('set_vault_apiStatus', "OK")
    }
  },
  computed: {
    vault_data() {
      return this.$store.getters['vault_data']
    }
  }
}
</script>

<style scoped>
.vaultapi_title {
  font-weight: 100;
}
</style>
