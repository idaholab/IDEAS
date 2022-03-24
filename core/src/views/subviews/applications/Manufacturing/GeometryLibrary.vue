<template>
  <div>
    <Card icon="mdi-cube-outline" cardTitle="Geometry Library">
      <span style="flex-basis: 100%; padding-bottom:1rem;">The Geometery Library contains utilities for defining, viewing, and
      editing preform geometry profiles. Geometry can be defined by tesselated geometry files or using sketch-based extrudes and revolves.</span>
      <ButtonGroup title="File-based Geometries">
        <FileGeometryForm /> <DeepLynxList metatype_name="FileGeometry"/>
      </ButtonGroup>

      <ButtonGroup title="Parametric Geometries">
        <ProfileGeometryForm /> <DeepLynxList metatype_name="ProfileGeometry"/>
      </ButtonGroup>
    </Card>
  </div>
</template>

<script>
import Card from '@/../components/card/Card.vue';
import ButtonGroup from '@/../components/card/ButtonGroup.vue';
import DeepLynxList from '@/../components/deeplynx/DeepLynxList.vue';
import FileGeometryForm from './Geometry/FileGeometryForm.vue';
import ProfileGeometryForm from './Geometry/ProfileGeometryForm.vue';

export default {
  name: 'GeometryLibrary',
  components: {
    Card,
    ButtonGroup,
    DeepLynxList,
    FileGeometryForm,
    ProfileGeometryForm
  },
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
}
</script>

<style>

</style>
