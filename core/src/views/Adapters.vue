<template>
  <div class="adaptersWrapper">
    <br>
    <div
      class="link"
      v-for="adapter in adapters_list"
      v-bind:key="adapter.name"
    >
      <!-- send post id as param to route -->
      <router-link
        :to="{
          name: 'Adapter',
          params: {
            name: adapter.name,
            adapter: adapter,
          },
        }"
        ><AdapterPreview :name="adapter.name"
      /></router-link>
      <br />
    </div>
  </div>
</template>

<script>
import AdapterPreview from "./subviews/adapters/AdapterPreview";

export default {
  name: "adapters",
  components: { AdapterPreview },
  computed: {
    adapters_list() {
      return this.$store.getters["adapters"];
    },
  },
};
</script>

<style scoped>
.link {
  max-width: 450px;
}
a {
  text-decoration: none !important;
}
.adaptersWrapper {
  padding: 2rem;
}
</style>
