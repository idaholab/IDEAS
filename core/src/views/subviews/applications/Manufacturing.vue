<template>
  <v-app id="manufacturing_app">
    <div class="manufacturing_container">
      <div class="title_section">
        <h2 class="manufacturing_title">Manufacturing Application</h2>
      </div>
      <div class="process_section">
        <ProcessLibrary />
      </div>
      <div class="parameter_section">
        <ParameterLibrary />
      </div>
      <div class="geometry_section">
        <GeometryLibrary />
      </div>
      <div class="material_section">
        <MaterialLibrary />
      </div>
    </div>
</v-app>
</template>

<script>
import ParameterLibrary from './Manufacturing/ParameterLibrary.vue'
import ProcessLibrary from './Manufacturing/ProcessLibrary.vue'
import GeometryLibrary from './Manufacturing/GeometryLibrary.vue'
import MaterialLibrary from './Manufacturing/MaterialLibrary.vue'

export default {
  name: 'Manufacturing',
  data: () => ({
  }),
  components: {
    ParameterLibrary,
    ProcessLibrary,
    GeometryLibrary,
    MaterialLibrary,
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>


#manufacturing_app {
  font-family: 'Montserrat';
}

.manufacturing_container {
  width: 90vw;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 7vh auto auto;
  gap: 2rem;
}

.title_section {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.process_section {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.parameter_section {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.geometry_section {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.material_section {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.manufacturing_title {
  font-weight: 100;
}
</style>
