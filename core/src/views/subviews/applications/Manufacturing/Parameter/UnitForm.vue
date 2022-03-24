<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Unit"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="Unit"
        ref="form"
      />
    </DeepLynxModal>
  </span>
</template>

<script>
import axios from 'axios'
import store from '@/store/index.js'
import DeepLynxModal from '@/../components/deeplynx/DeepLynxModal.vue'
import DeepLynxForm from '@/../components/deeplynx/DeepLynxForm.vue'
export default {
  name: 'UnitForm',
  components: {
    DeepLynxModal,
    DeepLynxForm
  },
  data: () => ({
    message: '',
    messageClass: ''
  }),
  methods: {
    async submit() {
      let form = await this.$refs.form.getForm()
      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"Unit": form}]
      ).then(response => {
        store.commit('set_message_text', `Unit posted with response status ${response.status}`)
        store.commit('set_message_type', "message_success")
        this.closeModal()
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
      })
    },
    refresh() {
      this.$refs.form.compileForm()
    },
    closeModal() {
      this.$refs.modal.closeModal()
    }
  }
}
</script>
