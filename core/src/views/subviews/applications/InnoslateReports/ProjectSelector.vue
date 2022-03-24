<template>
  <Card icon="mdi-sitemap-outline" cardTitle="Select project">
    <v-select @input="passId"
      v-model="select"
      :items=projects
      item-text="name"
      item-value="id"
    ></v-select>
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
export default {
  name: 'ProjectSelector',
  components: {
    Card
  },
  props: {
    projects: {
      type: Array,
      required: true
    },
  },
  data: () => ({
  }),
  methods: {
    passId() {
      this.$emit('setProject', this.select);
    }
  }
}
</script>

<style scoped>
input {
  background-color: white;
  border-radius: 4px;
}
</style>
