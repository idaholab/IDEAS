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
      <v-list-item v-on:click="make_documents()">
        <v-icon>mdi-database</v-icon>
        <v-list-item-content>Documents</v-list-item-content>
      </v-list-item>
      <v-list-item v-on:click="make_templates()">
        <v-icon>mdi-clipboard-edit</v-icon>
        <v-list-item-content>Templates</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <Home v-if="home"/>
      <DeepLynx v-if="documents"/>
      <Templates v-if="templates"/>
    </v-main>
  </v-app>
</template>

<script>
import Home from './components/Home';
import DeepLynx from './components/DeepLynx';
import Templates from './components/Templates';

export default {
  name: 'App',
  components: {
    Home,
    DeepLynx,
    Templates
  },
  props: {
    //
  },
  data: () => ({
    home: true,
    documents: false,
    templates: false
  }),
  methods: {
    go_home() {
      this.home = true;
      this.documents = false;
      this.templates = false;
    },
    make_documents() {
      this.home = false;
      this.documents = true;
      this.templates = false;
    },
    make_templates() {
      this.home = false;
      this.documents = false;
      this.templates = true;
    }
  }
};
</script>

<style scoped>
.logo {
  margin: 1rem;
}
</style>
