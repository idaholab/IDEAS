<template>
<span>
  <svg width="auto" height="70%" viewBox="0 0 370 120"
    xmlns="http://www.w3.org/2000/svg" version="1.1">
    <desc>Green/red light toggle to indicate status</desc>
    <filter id="light_on">
      <feFlood flood-color="rgba(205,205,205,0.9)" flood-opacity="0.5" in="SourceGraphic" />
      <feComposite operator="in" in2="SourceGraphic" />
      <feGaussianBlur stdDeviation="10" />
      <feComponentTransfer result="glow1">
        <feFuncA type="linear" slope="4" intercept="0" />
      </feComponentTransfer>
      <feMerge>
         <feMergeNode in="glow1" />
         <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <template v-if="status">
      <circle cx="70" cy="60" r="50" fill="#00cc33" filter="url(#light_on)" stroke="none"/>
      <circle cx="220" cy="60" r="50" fill="darkred" stroke="none"/>
    </template>
    <template v-else>
      <circle cx="70" cy="60" r="50" fill="darkgreen" stroke="none"/>
      <circle cx="220" cy="60" r="50" fill="red" filter="url(#light_on)" stroke="none"/>
    </template>
  </svg>
</span>
</template>

<script>
export default {
  name: 'TrafficLight',
  components: {
  },
  props: {
    status: Boolean
  }
}
</script>

<style lang="scss" scoped>

</style>
