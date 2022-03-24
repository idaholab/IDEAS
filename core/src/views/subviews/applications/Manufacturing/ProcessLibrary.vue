<template>
  <div>
    <Card icon="mdi-factory" cardTitle="Process Library">
      <span style="flex-basis: 100%; padding-bottom:1rem;">The Process Library contains utilities for defining, viewing, and
      editing types and instances of manufacturing processes with their subprocess and settings definitions.</span>
      <ButtonGroup title="Builds" >
        <BuildForm /> <DeepLynxList metatype_name="BuildInstance"/>
      </ButtonGroup>

      <ButtonGroup title="Manufacturing Processes" >
        <ProcessForm /> <DeepLynxList metatype_name="ManufacturingProcess"/>
      </ButtonGroup>
      <ButtonGroup title="Subprocesses" >
        <SubprocessForm /> <DeepLynxList metatype_name="ManufacturingSubprocess"/>
      </ButtonGroup>
      <ButtonGroup title="Settings" >
        <SettingForm /> <DeepLynxList metatype_name="ManufacturingSetting"/>
      </ButtonGroup>

    </Card>
  </div>
</template>

<script>
import Card from '@/../components/card/Card.vue';
import ButtonGroup from '@/../components/card/ButtonGroup.vue';
import DeepLynxList from '@/../components/deeplynx/DeepLynxList.vue'
import SettingForm from './Process/SettingForm.vue'
import SubprocessForm from './Process/SubprocessForm.vue'
import ProcessForm from './Process/ProcessForm.vue'
import BuildForm from './Process/BuildForm.vue'

export default {
  name: 'ProcessLibrary',
  components: {
    Card,
    ButtonGroup,
    DeepLynxList,
    SettingForm,
    SubprocessForm,
    ProcessForm,
    BuildForm
  },
  props: {
  },
  data: () => ({
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
