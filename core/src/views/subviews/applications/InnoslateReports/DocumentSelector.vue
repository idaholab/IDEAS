<template>
  <Card icon="mdi-file-document-multiple-outline" cardTitle="Select document">
    <v-select @input="passId"
      v-model="select"
      :items=documents
      item-text="name"
      item-value="id"
    ></v-select>
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
export default {
  name: 'DocumentSelector',
  components: {
    Card
  },
  props: {
    documents: {
      type: Array,
      required: true
    },
  },
  data: () => ({
  }),
  methods: {
    passId() {
      this.$emit('setDocument', this.select);
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
