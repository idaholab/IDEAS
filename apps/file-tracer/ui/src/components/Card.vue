<template>
<div style="height:100%">
  <v-card style="display: flex; flex-direction: column" flat>
    <v-card-title class="text-h4">
      <div class="card-title">{{ cardTitle }}</div>
      <div class="angle"></div>
    </v-card-title>
    <div class="card-body">
      <slot></slot>
    </div>
  </v-card>
</div>
</template>

<script>
export default {
  name: 'Card',
  components: {
  },
  props: {
    cardTitle: String
  }
}
</script>

<style lang="scss" scoped>

.v-card {
  background: #1e1e1e !important;

  & ::v-deep .v-card__title {
    padding: 0;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-wrap: nowrap;

    div.card-title {
      display: flex;
      width: 100%;
      font-size: 1rem;
      padding: .25rem .75rem .25rem 1rem;
      background: #3c3c3c;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #ffffff !important;
    }

    div.angle {
      margin-left: -.125rem;
      width: 1rem;
      height: 3rem;
      border-bottom: 3rem solid #1e1e1e;
      border-left: 1rem solid #3c3c3c;
    }
  }
}

.card-body {
  padding: 1rem;
  color: #4ebf94 !important;
}


</style>
