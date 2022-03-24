<template>
  <Card icon="mdi-login-variant" cardTitle="Log in">
    <table>
      <tr>
        <td>Innoslate Key</td>
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
  }),
  methods: {
    login() {
      this.$emit('setKeyString', this.password);
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
