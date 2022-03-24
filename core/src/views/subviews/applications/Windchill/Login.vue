<template>
  <Card icon="mdi-login-variant" cardTitle="Log in">
    <table>
      <tr>
        <td>Username</td>
        <td>&nbsp;:&nbsp;</td>
        <td><input type="text" v-model="username" /></td>
      </tr>
      <tr>
        <td>Password</td>
        <td>&nbsp;:&nbsp;</td>
        <td><input type="password" v-model="password" /></td>
      </tr>
      <tr>
        <td colspan="3">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="3">
          <center>
            <v-btn @click="login">
              Submit
            </v-btn>
          </center>
        </td>
      </tr>
    </table>
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
export default {
  name: 'Login',
  components: {
    Card
  },
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    login() {
      let auth_string = new Buffer(this.username + ':' + this.password).toString('base64')
      this.$emit('setAuthString', auth_string);
    }
  }
}
</script>

<style scoped>
input {
  background-color: white;
  border-radius: 4px;
}
</style>
