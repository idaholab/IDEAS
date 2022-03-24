<template>
  <div>
    <Card icon="mdi-tune" cardTitle="Parameter Library">
      <span style="flex-basis: 100%; padding-bottom:1rem;">The Parameter Library contains utilities for defining, viewing, and
      editing the datatypes associated with variables and their units.</span>
      <ButtonGroup title="Parameters" >
        <ParameterForm /> <DeepLynxList metatype_name="Parameter"/>
      </ButtonGroup>

      <ButtonGroup title="Units" >
        <UnitForm /> <DeepLynxList metatype_name="Unit"/>
      </ButtonGroup>

    </Card>
  </div>
</template>

<script>
import Card from '@/../components/card/Card.vue';
import ButtonGroup from '@/../components/card/ButtonGroup.vue';
import DeepLynxList from '@/../components/deeplynx/DeepLynxList.vue'
import UnitForm from './Parameter/UnitForm.vue'
import ParameterForm from './Parameter/ParameterForm.vue'

export default {
  name: 'ParameterLibrary',
  components: {
    Card,
    ButtonGroup,
    DeepLynxList,
    UnitForm,
    ParameterForm
  }
}
</script>

<style>

</style>
