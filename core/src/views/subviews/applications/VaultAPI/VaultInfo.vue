<template>
  <span>
    <v-icon @click="showModal()">mdi-information</v-icon>
    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        Vault API Information
      </template>
      <template v-slot:body>
        <span class="no_auth_message" v-if="vault_token=='NONE'">
          You need to authenticate with a username and password to unlock most
          services. Use the SignIn form inside of AuthService. If you don't
          know the dataServer, you can get it by submitting the
          GetServerIdentities function inside of IdentificationService.
        </span>
        <span class="auth_message" v-else>
          Authenticated
        </span>
        <br><br>
        <table class="info_table">
          <tr>
            <td>Token</td>
            <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
            <td>{{ vault_token }}</td>
          </tr>
          <tr>
            <td>User ID</td>
            <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
            <td>{{ vault_userId }}</td>
          </tr>
        </table>
      </template>
    </Modal>
  </span>
</template>

<script>
import Modal from '@/../components/modal/Modal.vue'
export default {
  name: 'VaultInfo',
  data: () => ({
    isModalVisible: false
  }),
  methods: {
    showModal () {
      this.isModalVisible = true
    },
    closeModal () {
      this.isModalVisible = false
    }
  },
  components: {
    Modal
  },
  computed: {
    vault_token() {
      return this.$store.getters['vault_token']
    },
    vault_userId() {
      return this.$store.getters['vault_userId']
    }
  }
}
</script>

<style scoped>
.v-icon {
 color: white;
 position: relative;
 bottom: .25rem;
}
.info_table {
  font-size: 75%;
  color: #c0c0c0;
}
.no_auth_message {
  font-size: 75%;
  color: #8C1823;
}
.auth_message {
  font-size: 75%;
  color: green;
}
</style>
