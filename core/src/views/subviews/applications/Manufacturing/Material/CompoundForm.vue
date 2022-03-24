<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Compound"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="Compound"
        ref="form"
      />

      <table>
        <template v-for="mc in material_constituents" >
          <tr v-bind:key="mc[0].selector_heading"><td><center>{{ mc[0].selector_heading }}</center></td></tr>
          <tr v-bind:key="mc[0].selector_heading + 'BODY'"><td>
            <DeepLynxForm
              metatype_name="MaterialConstituent"

              :excluded_fields="excluded_fields"
              :connected_metatypes = "mc"
              :ref="mc[0].selector_heading"
            />
          </td></tr>
        </template>
      </table>

      <v-btn @click="add_material_constituent()">Add a material</v-btn>
    </DeepLynxModal>
  </span>
</template>

<script>
import axios from 'axios'
import store from '@/store/index.js'
import DeepLynxModal from '@/../components/deeplynx/DeepLynxModal.vue'
import DeepLynxForm from '@/../components/deeplynx/DeepLynxForm.vue'
export default {
  name: 'ParameterForm',
  components: {
    DeepLynxModal,
    DeepLynxForm
  },
  data: () => ({
    message: '',
    messageClass: '',
    material_constituents: [
      // [{
      //   "selector_name": "material 1",
      //   "metatype_name": "Material",
      //   "multiple": false
      // }]
    ],
    excluded_fields: [
      "id", "name", "description"
    ]
  }),
  methods: {
    async submit() {
      let compound_form = await this.$refs.form.getForm()
      let material_constituents_data = []
      let sum = 0
      for (var i=0; i < this.material_constituents.length; i++) {
        let form = this.$refs[this.material_constituents[i][0].selector_heading][0]
        let const_data = await form.getForm()
        sum += parseFloat(const_data.composition)
        material_constituents_data.push(
          const_data
        )
      }

      compound_form["MaterialConstituents"] = material_constituents_data

      if (sum != 1.0) {
        this.message = "The sum of the composition values must equal 1."
        this.messageClass = "message_error"
        return
      }



      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"Compound": compound_form}]
      ).then(response => {
        store.commit('set_message_text', `Compound posted with response status ${response.status}`)
        store.commit('set_message_type', "message_success")
        this.closeModal()
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
      })
    },
    add_material_constituent() {
      let count = this.material_constituents.length + 1

      this.material_constituents = [...this.material_constituents,
        [{
          "selector_name": `material`,
          "selector_heading": `Material ${count}`,
          "metatype_name": "Material",
          "multiple": false
        }]
      ]
    },
    refresh() {
      this.$refs.form.compileForm()
      this.material_constituents = []
    },
    closeModal() {
      this.$refs.modal.closeModal()
      this.material_constituents = []
    }
  }
}
</script>
