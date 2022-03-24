<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new File-based Geometry"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="FileGeometry"
        :file_upload="true"
        ref="form"
      />
    </DeepLynxModal>
  </span>
</template>

<script>
import axios from 'axios'
import uuid from 'uuid-random'
import FormData from 'form-data';
import store from '@/store/index.js'
import DeepLynxModal from '@/../components/deeplynx/DeepLynxModal.vue'
import DeepLynxForm from '@/../components/deeplynx/DeepLynxForm.vue'
export default {
  name: 'FileGeometryForm',
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
      // TODO: metadata must be attached as a json file with the following structure with the field name metadata
      // [{
      //    "SampleGeometry": {
      //      "id": uuid()
      //      "name": (match file geometry name)
      //      "descripition": (match file geometry descripition)
      //      "FileGeometry": form
      //    }
      // }]
      // TODO: attach file object itself with the field name file (or whatever)
      //
      //  {{baseUrl}}/containers/:container_id/import/datasources/:data_source_id/files
      //  Headers: {Content-Type: multipart/form-data, Accept: application/json}
      //
      // Then to get, get node id, then use DL node id (not uuid) to query
      // /containers/:container_id/graphs/nodes/:node_id/files
      // /containers/3/graphs/nodes/137232/files
      //
      // and you'll get {"value":[{"metadata":{},"id":"2","container_id":"3","data_source_id":"3","file_name":"test.stl","file_size":2387.33,"adapter_file_path":"containers/3/datasources/3/","adapter":"azure_blob","created_at":"2022-03-09T23:36:15.607Z","modified_at":"2022-03-09T23:36:15.607Z","created_by":"4","modified_by":"4","md5hash":"8b3f8d43e61af00c86633b3983463c16"}],"isError":false}
      // Then
      // /containers/:container_id/files/:file_id to retrieve
      // {{baseUrl}}/containers/:container_id/files/:file_id/download to download, you'll get string of ASCII or binary as response
      let formData = new FormData()

      let file_form = await this.$refs.form.getForm()
      let geometry_form = [{
        "SampleGeometry": {
           "id": uuid(),
           "name": file_form.name,
           "descripition": file_form.description,
           "FileGeometry": file_form
         }
      }]
      let metadata_string = JSON.stringify(geometry_form)
      let metadata_blob = new Blob([metadata_string], { type: 'application/json'})
      let metadata = new File([metadata_blob], 'metadata.json')

      formData.append('metadata', metadata)

      let file = await this.$refs.form.getFile()

      if (file) {
        formData.append('file', file)
        console.log('added')
      } else {
        this.message = "You must select a file to submit this metatype."
        this.messageClass = "message_error"
        return
      }

      for (var key of formData.entries()) {
        console.log(key)
      }

      await axios.post(
        `/api/apps/deeplynx/post_files/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        formData,
        {headers: {'Content-Type': `multipart/form-data`, 'Access-Control-Allow-Origin': '*'}}
      ).then(response => {
        store.commit('set_message_text', `FileGeometry posted with response status ${response.status}`)
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
