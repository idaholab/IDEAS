<template>
  <div>
    <div class="form">
      <div><h3>{{ service_function }} ({{ form_method() }})</h3><br></div>
      <form :id="form_id">
        <table style="padding-left:50px;">
          <template v-if="form_method() == 'POST'">
            <tr>
              <td>INPUT: </td>
              <td style="padding-left:5px;">
                <textarea :id="textarea_id" rows="10" cols="80"
                  style="background-color:white;padding:5px;" type="text"
                  :placeholder="stringified_input">
                </textarea>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(place_holder, field_name) in description.input" v-bind:key="field_name">
              <td>{{ field_name }}: </td>
              <td style="padding-left:5px;">
                <input v-if="field_name=='userPassword'" :name="field_name" style="background-color:white;padding:5px;" type="password" :placeholder="place_holder" />
                <input v-else :name="field_name" style="background-color:white;padding:5px;" type="text" :placeholder="place_holder" />
              </td>
            </tr>
          </template>
          <tr>
            <td>&nbsp;</td><td></td>
          </tr>
          <tr>
            <td>OUTPUT: </td>
            <td>
              <textarea rows="1" cols="80" name="post_data"
                style="background-color:#e0e0e0;padding:5px;" type="text"
                v-model="stringified_output" disabled>
              </textarea>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td><td></td>
          </tr>
        </table>
        <v-btn @click="submit_form()">Submit</v-btn>
      </form><br><br>
      <span v-if="response">{{ response }}</span>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  name: 'VaultFunction',
  props: {
    description: Object,
    service_function: String,
    service: Object,
    service_type: String
  },
  data: () => ({
    response: null,
    authenticated: false
  }),
  methods: {
    nestLevel (obj) {
      let level = 1;
      for(var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          if(typeof obj[key] == 'object'){
              let depth = this.nestLevel(obj[key]) + 1;
              level = Math.max(depth, level);
          }
      }
      return level;
    },
    form_method () {
      if (this.nestLevel(this.description.input) > 1) {
        return "POST"
      } else {
        return "GET"
      }
    },
    async submit_form () {
      let form = document.getElementById(this.form_id)
      // let temp_response = {"data": {"RESULT": {}}}
      // temp_response["data"]["RESULT"][`${this.service_function}Result`] = null

      if (this.form_method() == "GET") {
        let form_data = new URLSearchParams(new FormData(form)).toString()
        let temp_response = await axios.get(`${this.form_address}?${form_data}`)
        this.response = temp_response.data["RESULT"]
        this.check_auth(await temp_response)
      } else if (this.form_method() == "POST") {
        let temp_data = document.getElementById(this.textarea_id)
        let form_data = JSON.parse(temp_data.value)
        let temp_response = await axios.post(this.form_address, form_data)
        this.response = temp_response.data["RESULT"]
        this.check_auth(temp_response)
      }

      //this.response = temp_response.data["RESULT"]
    },
    check_auth (temp_response) {
      if (temp_response.data["SERVICE"] == "AuthService" && temp_response.data["TICKET"]) {
        this.$store.commit(
          'set_deep_lynx_health',
          true
        )
        this.$store.commit(
          'set_vault_userId',
          temp_response.data["USER_ID"]
        )
        this.$store.commit(
          'set_vault_token',
          temp_response.data["TICKET"]
        )
        // alert("Authenticated!")
        this.response = "Authenticated!"
      }

    }
  },
  computed: {
    form_address () {
      let address = `/api/apps/vault/soap/` +
        `${this.service_type}/${this.service.name}/${this.service_function}/` +
        `${this.$store.getters['vault_token']}/` +
        `${this.$store.getters['vault_userId']}`

      return address
    },
    form_id() {
      return `${this.service_type}|${this.service.name}|${this.service_function}`
    },
    textarea_id() {
      return `textarea|${this.service_type}|${this.service.name}|${this.service_function}`
    },
    stringified_input () {
      return JSON.stringify(this.description.input, undefined, 4)
    },
    stringified_output () {
      let string = JSON.stringify( this.description.output, undefined, 4)
      string = string.substring(2, string.length-2)
      return string
    }
  }
}
</script>

<style>
.form {
  background-color: #e0e0e0;
  margin: 1.5em;
  border-radius: 0.25em;
  padding:1.5em;
}
</style>
