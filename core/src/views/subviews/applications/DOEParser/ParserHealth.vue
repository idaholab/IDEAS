<template>
  <Card icon="mdi-heart-pulse" cardTitle="Health" :hasStatus="true" :status="health">
    <span class="health_text">
      The DOE document parsing server is
      <span v-if="health" class="accessible">accessible</span>
      <span v-else class="inaccessible">inaccessible</span>.
    </span>
  </Card>
</template>

<script>
import axios from 'axios'
import Card from '@/../components/card/Card.vue'
export default {
  name: 'WindchillHealth',
  data: () => ({
    health: false
  }),
  components: {
    Card
  },
  methods: {
    async check_health () {
      await axios.get('/api/apps/doe-parser/health').then(response => {
        if (response.data) {
          if (response.data[0]) {
            if (response.data[0].value == 'OK') {
              this.health = true;
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
  },
  computed: {
  },
  mounted: function() {
    this.check_health()
  }
}
</script>

<style scoped>

.health_text {
  color: white;
}

.accessible {
  color: #4ebf94;
}

.inaccessible {
  color: #D12335;
}
</style>
