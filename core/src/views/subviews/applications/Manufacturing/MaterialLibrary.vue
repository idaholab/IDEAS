<template>
  <div>
    <Card icon="mdi-grain" cardTitle="Material Library">
      <span style="flex-basis: 100%; padding-bottom:1rem;">The Material Library contains utilities for defining, viewing, and
      editing materials and compounds and their required and optional parameters.</span>
      <ButtonGroup title="Compounds">
        <CompoundForm /> <DeepLynxList metatype_name="Compound"/>
      </ButtonGroup>

      <ButtonGroup title="Materials" >
        <MaterialForm /> <DeepLynxList metatype_name="Material"/>
      </ButtonGroup>

      <ButtonGroup title="Material Types" >
        <MaterialTypeForm /> <DeepLynxList metatype_name="MaterialType"/>
      </ButtonGroup>

    </Card>
  </div>
</template>

<script>
import Card from '@/../components/card/Card.vue';
import ButtonGroup from '@/../components/card/ButtonGroup.vue';
import DeepLynxList from '@/../components/deeplynx/DeepLynxList.vue'
import MaterialTypeForm from './Material/MaterialTypeForm.vue'
import MaterialForm from './Material/MaterialForm.vue'
import CompoundForm from './Material/CompoundForm.vue'

export default {
  name: 'MaterialLibrary',
  components: {
    Card,
    ButtonGroup,
    DeepLynxList,
    MaterialTypeForm,
    MaterialForm,
    CompoundForm
  },
  props: {
  },
  data: () => ({
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
    material_connected_types: [
      {
        "selector_name": "material type",
        "metatype_name": "MaterialType",
        "multiple": false
      }
    ],
    material_parameter_defining_types: [
      {
        "heading_name": "Required Parameters",
        "metatype_name": "MaterialType",
        "relationship": "decomposedBy"
      },
      {
        "heading_name": "Optional Parameters",
        "metatype_name": "MaterialType",
        "relationship": "references"
      }
    ]
  }),
  computed: {
  },
  methods: {
  }
}
</script>

<style>

</style>
