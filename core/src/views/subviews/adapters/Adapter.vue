<template>
  <div class="adapterWrapper">
    <h1>{{ adapter.name }}</h1>

    <br>

    <v-card class="adapter-card">
      <v-card-title>
        Status:&nbsp;&nbsp;
        <span class="adapterStatus">
          <TrafficLight :status="status.is_active"/>
        </span>
      </v-card-title>
      <hr />
      <v-card-text>
        <span v-if="status.is_active">
          The adapter is active and can be reached at its Health endpoint:
          <span class="code"><a :href='adapter.health_url' target="_blank">{{ adapter.health_url }}</a></span>
        </span>
        <span v-else>
          The adapter is inactive or else can not be reached at its Health endpoint:
          <span class="code"><a :href='adapter.health_url' target="_blank">{{ adapter.health_url }}</a></span>
        </span>
      </v-card-text>
    </v-card>

    <br /><br />

    <v-card class="adapter-card">
      <v-card-title>
        Description
      </v-card-title>
      <hr />
      <v-card-text>
        <div>
          {{ adapter.description }}
        </div>
      </v-card-text>
    </v-card>

    <br /><br />

    <v-card class="adapter-card">
      <v-card-title>
        Endpoints
      </v-card-title>
      <hr />
      <v-card-text>
        <EndpointForm v-for="endpoint in adapter.endpoints"
          v-bind:key="endpoint.name" :endpoint="endpoint" :baseUrl="adapter.base_url"/>
      </v-card-text>
    </v-card>

    <br />
    <br />
    <router-link to="/adapters">Back to Adapter List</router-link>
  </div>
</template>

<script>
import axios from "axios";
import TrafficLight from "@/../components/status/TrafficLight";
import EndpointForm from "@/../components/forms/EndpointForm";

export default {
  name: "Adapter",
  components: {
    TrafficLight,
    EndpointForm
  },
  props: {
    name: {
      type: String,
      required: true,
    },
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
    },
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

<style scoped>
.adapter-card {
  max-width: 750px;
  background-color: #292929;
}
.adapterWrapper {
  padding: 2rem;
}
.adapterStatus {
  padding-top:0.2rem;
  font-size: 1.25rem;
  display: flex;
  flex-wrap: nowrap;
  height: 2rem;
}
.code {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.7);
  color: #1E1E1E;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  border-radius: 0.125rem;
}
.code a {
  text-decoration: none !important;
  color: #121212;
}
</style>
