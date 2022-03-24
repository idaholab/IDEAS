<template>
  <span>
    <DeepLynxModal
      @submit="submit"
      @refresh="refresh"
      title="Add a new Build"
      :message="message"
      :messageClass="messageClass"
      ref="modal"
    >
      <DeepLynxForm
        metatype_name="Build"
        :connected_metatypes="build_connected_types"
        @itemselected="getParameters"
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
    build_connected_types: [
      {
        "selector_name": "process",
        "metatype_name": "ManufacturingProcess",
        "multiple": false
      },
      {
        "selector_name": "compound",
        "metatype_name": "Compound",
        "multiple": false
      },
      {
        "selector_name": "geometry",
        "metatype_name": "SampleGeometry",
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
      let formatted_timestamped_params = []
      let formatted_single_params = []

      for (const ident in params) {
        if (typeof params[ident] == 'object') {
          let temp_entries = []
          for (var i=0; i < params[ident].length; i++) {
            temp_entries.push({...params[ident][i], 'id': uuid()})
          }
          formatted_timestamped_params.push({
            "type": this.all_params[ident].type,
            "parameter": this.all_params[ident].id,
            "entries": temp_entries
          })
        } else {
          formatted_single_params.push({
            "id": uuid(),
            "type": this.all_params[ident].type,
            "parameter": this.all_params[ident].id,
            "value": params[ident]
          })
        }

      }

      form["TimestampedParameters"] = formatted_timestamped_params
      form["SingleParameters"] = formatted_single_params

      await axios.post(
        `/api/apps/deeplynx/post_object/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_datasource}/${store.getters.deep_lynx_token}`,
        [{"Build": form}]
      ).then(response => {
        store.commit('set_message_text', `Build posted with response status ${response.status}`)
        store.commit('set_message_type', "message_success")
        this.closeModal()
      }).catch(error => {
        this.message = error.message
        this.messageClass = "message_error"
      })
    },
    async getParameters(event) {
      console.log(event)

      if (event.name == "Compound" || event.name == "SampleGeometry") {
        return true;
      } else if (event.name == "ManufacturingProcess") {
        let ident = this.cleanId(event.id)
        console.log(ident)
        await axios.post(
          `/api/apps/deeplynx/query/${store.getters.deep_lynx_container}/${store.getters.deep_lynx_token}`,
          {"query": `{
              nodes(where: {AND: [{original_data_id: "eq ${ident}"}]}) {
                        incoming_edges {
                            origin_node {
                                raw_properties
                                metatype {
                                    name
                                }
                                outgoing_edges {
                                    destination_node {
                                        raw_properties
                                        metatype {
                                            name
                                        }
                                        outgoing_edges {
                                            destination_node {
                                                raw_properties
                                                metatype {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
          }}`}
        ).then(response => {
          let temp_groups = {
            "settings": [],
            "subprocesses": []
          }

          let hash = {
            "ManufacturingSetting": "settings",
            "ManufacturingSubprocess": "subprocesses"
          }

          let time_entry_hash = {
            "ManufacturingSetting": false,
            "ManufacturingSubprocess": true
          }

          let incomers = response.data[0].data.nodes[0].incoming_edges
          for (var i=0; i < incomers.length; i++) {
            let incomer = incomers[i]
            let incomer_props = JSON.parse(incomer.origin_node.raw_properties)
            let incomer_metatype = incomer.origin_node.metatype.name
            let unit_abbrev = ''
            let parameter_type = ''

            for (var j=0; j < incomer.origin_node.outgoing_edges.length; j++) {
              let node = incomer.origin_node.outgoing_edges[j].destination_node
              if (node.metatype.name == "Parameter") {
                let type_obj = JSON.parse(node.raw_properties)
                parameter_type = type_obj.parameter_type
                if (node.outgoing_edges.length > 0) {
                  let unit_props = JSON.parse(node.outgoing_edges[0].destination_node.raw_properties)
                  unit_abbrev = unit_props.abbreviation
                }
              }
            }

            temp_groups[hash[incomer_metatype]].push(
              {
                "name": incomer_props.name,
                "id": this.cleanId(incomer_props.id),
                "type": parameter_type,
                "unit_abbrev": unit_abbrev,
                "time_entry": time_entry_hash[incomer_metatype]
              }
            )

            //for reference when compiling form for submission
            this.all_params[this.cleanId(incomer_props.id)] = {
              "id": incomer_props.id,
              "type": parameter_type
            }
          }
          this.parameter_groups = temp_groups
          return true
        }).catch(error => {
          this.message = error.message
          this.messageClass = "message_error"
          return false
        })
      }
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
