<template>
  <div class="adapterWrapper">
    <Card :cardTitle="endpoint.name">
      <v-card-text>
        <strong>URL</strong>&nbsp;&nbsp;:&nbsp;&nbsp;
        <span class="code">
          <a :href="baseUrl + endpoint.extension" target="_blank">
            {{ endpoint.extension }}
          </a>
        </span>
        <br><br>
        <form :id="'form|' + endpoint.name">
            <table class="auth_table">
              <template v-if="endpoint.auth=='basic'">
                <tr>
                  <td>Username</td>
                  <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                  <td><input type="text" name="basic|username" required/></td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                  <td><input type="password" name="basic|password" required/></td>
                </tr>
              </template>
              <tr v-for="param in url_parameters" v-bind:key="param">
                <td><strong>{{ param }}</strong></td>
                <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                <td><input type="text" :name="param" required/></td>
              </tr>
            </table>
          <br><br>
          <v-btn v-on:click="submit_form('form|' + endpoint.name)">Submit</v-btn>
        </form>
        <template v-if="response">
          <br>
          <div class="code" style="margin:2rem;">{{ response }}</div>
        </template>
      </v-card-text>
    </Card>
  </div>
</template>

<script>
import axios from "axios";
import Card from '@/../components/card/Card'


export default {
  name: "EndpointForm",
  components: {
    Card
  },
  props: {
    endpoint: {
      type: Object,
      default: function() {
        return {
          name: "Test",
          extension: "/test",
          method: 'GET',
          auth: null
        }
      }
    },
    baseUrl: String,
    response: null
  },
  methods: {
    submit_form(form_id) {
      var elements = document.getElementById(form_id).elements;
      var username = "";
      var password = "";
      var param_map = {};
      var header = "";
      var url = this.endpoint.extension;

      if (elements) {
        elements.forEach(element => {
          if (element) {
            if (element.name == "basic|username") {
              username = element.value;
            } else if (element.name == "basic|password") {
              password = element.value;
            } else if (element.name[0] == ":") {
              param_map[element.name] = element.value
            }
          }
        });
      }


      if (this.endpoint.auth == "basic") {
        header = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
      }

      for (const property in param_map) {
        url = url.replace(property, param_map[property]);
      }
      console.log(this.baseUrl + url);

      axios({
        method: this.endpoint.method,
        url: this.baseUrl + url,
        headers: {Authorization: header}
      }).then(response => {
        this.response = response.data;
      }).catch(error => {
        this.response = error;
      });
    }
  },
  mounted: async function () {

  },
  computed: {
    url_parameters() {
      var parameters = [];
      var temp_params = this.endpoint.extension.split('/');
      temp_params.forEach( param => {
        if (param[0] == ":") {
          parameters.push(param);
        }
      });

      return parameters;
    }
  }
};
</script>

<style scoped>
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
input {
  background: rgba(255, 255, 255, 0.7);
}
</style>
