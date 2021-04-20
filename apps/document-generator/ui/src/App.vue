<template>
  <v-app>

    <v-app-bar app flat>
      <v-list-item>
        <v-icon size=20 class="logo">mdi-file-document-multiple</v-icon>
        <h2>Document Generator</h2>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-btn icon href="https://gitlab.software.inl.gov/b650/nric-de/-/tree/main/apps/document-generator" target="_blank">
        <v-icon>mdi-gitlab</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app permanent>
      <v-list-item v-on:click="go_home()">
        <v-icon>mdi-home</v-icon>
        <v-list-item-content>Home</v-list-item-content>
      </v-list-item>
      <v-list-item v-on:click="deep_lynx()">
        <v-icon>mdi-database</v-icon>
        <v-list-item-content>Deep Lynx</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <Home v-if="home"/>
      <DeepLynx v-if="deepLynx"/>
    </v-main>
  </v-app>
</template>

<script>
import Home from './components/Home';
import DeepLynx from './components/DeepLynx';

export default {
  name: 'App',
  components: {
    Home,
    DeepLynx
  },
  props: {
    //
  },
  data: () => ({
    home: true,
    deepLynx: false,
  }),
  methods: {
    go_home() {
      this.home = true;
      this.deepLynx = false;
    },
    deep_lynx() {
      this.home = false;
      this.deepLynx = true;
    }
  }
};
</script>

<style scoped>
.logo {
  margin: 1rem;
}
</style>
