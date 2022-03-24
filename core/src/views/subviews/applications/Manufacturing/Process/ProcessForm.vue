<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Manufacturing Process"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="ManufacturingProcess"
        :connected_metatypes="process_connected_types"
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
  name: 'ProcessForm',
  components: {
    DeepLynxModal,
    DeepLynxForm
  },
  data: () => ({
    message: '',
    messageClass: '',
    process_connected_types: [
      {
        "selector_name": "material types",
        "metatype_name": "MaterialType",
        "multiple": true
      },
      {
        "selector_name": "subprocesses",
        "metatype_name": "ManufacturingSubprocess",
        "multiple": true
      },
      {
        "selector_name": "settings",
        "metatype_name": "ManufacturingSetting",
        "multiple": true
      }
    ],
  }),
  methods: {
    async submit() {
      let form = await this.$refs.form.getForm()
      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"ManufacturingProcess": form}]
      ).then(response => {
        store.commit('set_message_text', `ManufacturingProcess posted with response status ${response.status}`)
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
