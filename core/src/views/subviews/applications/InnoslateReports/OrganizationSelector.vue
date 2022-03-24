<template>
  <Card icon="mdi-account-group-outline" cardTitle="Select organization">
    <v-select @input="passSlug"
      v-model="select"
      :items=organizations
      item-text="name"
      item-value="slug"
    ></v-select>
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
export default {
  name: 'OrganizationSelector',
  components: {
    Card
  },
  props: {
    organizations: {
      type: Array,
      required: true
    },
  },
  data: () => ({
  }),
  methods: {
    passSlug() {
      this.$emit('setOrganization', this.select);
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
