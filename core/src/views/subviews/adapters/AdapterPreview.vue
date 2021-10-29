<template>
  <div>
    <Card :cardTitle="adapter.name" :hasStatus="true" :status="status.is_active">
      <v-card-text>{{ adapter.description }}</v-card-text>
      <br />
    </Card>
  </div>
</template>

<script>
import axios from "axios";
import Card from "@/../components/card/Card"

export default {
  name: "adapter-preview",
  components: {
    Card
  },
  props: {
    name: {
      type: String,
      required: true,
    }
  },
  data: function() {
    return {
      status: {
        is_active: false
      }
    }
  },
  computed: {
    adapters() {
      return this.$store.getters["adapters"];
    },
    adapter() {
      return this.adapters.find((adapter) => adapter.name === this.name);
    }
  },
  mounted: async function () {
    // I think here is where you're going to set adapter.is_active
    await axios.get(this.adapter.health_url).then((response) => {
      if (response.data[0].value=="OK") {
        this.$set(this.status, 'is_active', true);
      } else {
        this.$set(this.status, 'is_active', false);
      }
    }).catch((err) => {
      console.log(err)
      this.$set(this.status, 'is_active', false);
    });
  },
};
</script>
