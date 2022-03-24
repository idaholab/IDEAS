<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Material"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="Material"
        :connected_metatypes="material_connected_types"
        @itemselected="getMaterialTypeParameters"
        :parameter_groups="parameter_groups"
        ref="form"
      />
    </DeepLynxModal>
  </span>
</template>

<script>
import axios from 'axios'
import uuid from 'uuid-random'
import store from '@/store/index.js'
import DeepLynxModal from '@/../components/deeplynx/DeepLynxModal.vue'
import DeepLynxForm from '@/../components/deeplynx/DeepLynxForm.vue'
export default {
  name: 'MaterialForm',
  components: {
    DeepLynxModal,
    DeepLynxForm
  },
  data: () => ({
    message: '',
    messageClass: '',
    material_connected_types: [
      {
        "selector_name": "material type",
        "metatype_name": "MaterialType",
        "multiple": false
      }
    ],
    parameter_groups: {},
    all_params: {}
  }),
  methods: {
    async submit() {
      let form = await this.$refs.form.getForm()
      let params = await this.$refs.form.getParams()
      let formatted_params = []

      for (const ident in params) {
        formatted_params.push({
          "id": uuid(),
          "type": this.all_params[ident].type,
          "parameter": this.all_params[ident].id,
          "value": params[ident]
        })
      }
      form["Parameters"] = formatted_params

      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"Material": form}]
      ).then(response => {
        store.commit('set_message_text', `Material posted with response status ${response.status}`)
        store.commit('set_message_type', "message_success")
        this.closeModal()
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
      })
    },
    async getMaterialTypeParameters(event) {
      let ident = event.id.replaceAll('"', '')
      await axios.post(
        `/api/apps/deeplynx/query/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_token}`,
        {"query": `{
          nodes(limit:100, where: {AND: [{original_data_id: "eq ${ident}"}]}) {
            outgoing_edges {
                destination_node {
                    raw_properties
                    outgoing_edges {
                        destination_node {
                            raw_properties
                        }
                    }
                }
                relationship {
                    name
                }

            }
          }
        }`}
      ).then(response => {
        let temp_groups = {
          "required": [],
          "optional": []
        }

        let hash = {
          "decomposedBy": "required",
          "references": "optional"
        }

        let params = response.data[0].data.nodes[0].outgoing_edges
        for (var i=0; i < params.length; i++) {
          let param = params[i]
          let param_props = JSON.parse(param.destination_node.raw_properties)
          let unit_abbrev = ''
          if (param.destination_node.outgoing_edges.length > 0) {
            let unit_props = JSON.parse(param.destination_node.outgoing_edges[0].destination_node.raw_properties)
            unit_abbrev = unit_props.abbreviation
          }
          temp_groups[hash[param.relationship.name]].push(
            {
              "name": param_props.name,
              "id": this.cleanId(param_props.id),
              "type": param_props.parameter_type,
              "unit_abbrev": unit_abbrev,
              "time_entry": false
            }
          )
          //for reference when compiling form for submission
          this.all_params[this.cleanId(param_props.id)] = {
            "id": param_props.id,
            "type": param_props.parameter_type
          }
        }
        this.parameter_groups = temp_groups
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
      })
    },
    cleanId(ident) {
      if (ident) {
        return ident.replaceAll('"', '')
      } else {
        return ident
      }
    },
    refresh() {
      this.$refs.form.compileForm()
      this.parameter_groups = {}
      this.all_params = {}
    },
    closeModal() {
      this.$refs.modal.closeModal()
      this.parameter_groups = {}
      this.all_params = {}
    }
  }
}
</script>
