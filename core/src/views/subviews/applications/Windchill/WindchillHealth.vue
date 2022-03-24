<template>
  <Card icon="mdi-heart-pulse" cardTitle="Health" :hasStatus="true" :status="health">
    <span class="hostname_message">
      The Windchill server running at <span class="hostname_url">{{ hostname }}</span> is
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
    health: false,
    hostname: "HOSTNAME NOT REACHABLE"
  }),
  components: {
    Card
  },
  methods: {
    async check_health () {
      await axios.get('/api/adapters/windchill/health').then(response => {
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
    async get_hostname() {
      await axios.get('/api/adapters/windchill/hostname').then(response => {
        this.hostname = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  computed: {
  },
  mounted: function() {
    this.get_hostname()
    this.check_health()
  }
}
</script>

<style scoped>

.hostname_message {
  color: white;
}

.hostname_url {
  color: #4ebf94;
}

.accessible {
  color: #4ebf94;
}

.inaccessible {
  color: #D12335;
}
</style>
