<template>
<div style="height:100%">
  <v-card style="display: flex; flex-direction: column" flat>
    <v-card-title class="text-h4">
      <div class="card-title">
        <v-icon class="card_icon" v-if="icon != ''">{{ icon }}</v-icon>
        {{ cardTitle }}
      </div>
      <div v-if="hasStatus" class="card-status">
        <TrafficLight :status="status" />
      </div>
      <div class="angle"></div>
    </v-card-title>
    <div class="card-body">
      <slot></slot>
    </div>
  </v-card>
</div>
</template>

<script>
import TrafficLight from "@/../components/status/TrafficLight"
export default {
  name: 'Card',
  components: {
    TrafficLight
  },
  props: {
    cardTitle: String,
    hasStatus: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>

.v-card {
  font-family: 'Montserrat' !important;
  background: #1e1e1e !important;

  & ::v-deep .v-card__title {
    padding: 0;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-wrap: nowrap;

    div.card-title {
      font-family: 'Montserrat' !important;
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

    div.card-status {
      margin-left: -0.125rem;
      padding-top:0.6rem;
      font-size: 1rem;
      background: #3c3c3c;
      white-space: nowrap;
      height: 3rem;
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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card_icon {
  padding-right: 0.5rem;
}


</style>
