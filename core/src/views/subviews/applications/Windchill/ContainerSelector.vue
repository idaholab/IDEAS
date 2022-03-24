<template>
  <Card icon="mdi-group" cardTitle="Select container">
    <v-select @input="passId"
      v-model="select"
      :items="containers"
      item-text="Name"
      item-value="ID"
    ></v-select>
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
export default {
  name: 'Login',
  components: {
    Card
  },
  props: {
    containers: {
      type: Array,
      required: true
    },
  },
  data: () => ({
    select: ''
  }),
  methods: {
    passId() {
      this.$emit('setContainer', this.select);
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
