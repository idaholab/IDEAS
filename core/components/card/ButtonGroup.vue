<template>
  <div class="group" >
    <div class="header">{{ title }}</div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  components: {
  },
  props: {
    title: String
  }
}
</script>

<style scoped>
.group {
  background-color: #3c3c3c;
  border-radius: 4px;
}

.header {
  color: white;
  background-color: #3c3c3c;
  text-align: center;
  width:100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 2px solid #1e1e1e;
  padding: 0.25rem 1rem 0.25rem 1rem;
}

.body {
  padding:0.5rem;
  text-align: center;
}
</style>
