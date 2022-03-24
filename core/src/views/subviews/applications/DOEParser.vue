<template>
  <div>
    <h2 class="parser_title">DOE Parser</h2><br><br>

    <div class="parser_home">
      <ParserHealth />
      <ParserUpload />
    </div>
  </div>
</template>

<script>
import ParserHealth from './DOEParser/ParserHealth.vue'
import ParserUpload from './DOEParser/ParserUpload.vue'
export default {
  name: 'DOEParser',
  data: () => ({
    doe_file: null
  }),
  components: {
    ParserHealth,
    ParserUpload
  },
  methods: {
  },
  computed: {
  },
  mounted: function() {
  }
}
</script>

<style scoped>
.parser_title {
  font-weight: 100;
}

.parser_home {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

</style>
