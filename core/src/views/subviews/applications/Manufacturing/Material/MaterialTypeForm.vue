<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Material Type"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="MaterialType"
        :connected_metatypes="materialtype_connected_types"
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
  name: 'MaterialTypeForm',
  components: {
    DeepLynxModal,
    DeepLynxForm
  },
  data: () => ({
    message: '',
    messageClass: '',
    materialtype_connected_types: [
      {
        "selector_name": "required parameters",
        "metatype_name": "Parameter",
        "multiple": true
      },
      {
        "selector_name": "optional parameters",
        "metatype_name": "Parameter",
        "multiple": true
      }
    ],
  }),
  methods: {
    async submit() {
      let form = await this.$refs.form.getForm()
      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"MaterialType": form}]
      ).then(response => {
        store.commit('set_message_text', `Material Type posted with response status ${response.status}`)
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
