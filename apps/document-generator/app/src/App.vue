<template>
  <v-app>

    <v-app-bar app flat>
      <v-list-item>
        <v-img max-height="30" max-width="30" class="logo" src="@/assets/doge.png"></v-img>
        <h2>Document Generator</h2>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-btn icon href="https://gitlab.software.inl.gov/b650/nric-de/-/tree/main/apps/document-generator" target="_blank">
        <v-icon>mdi-gitlab</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app permanent>
      <v-list-item link to="/">
        <v-icon class="icon">mdi-home</v-icon>
        <v-list-item-content>Home</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/deeplynx">
        <v-icon class="icon">mdi-file-document-multiple</v-icon>
        <v-list-item-content>Deep Lynx</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/templates">
        <v-icon class="icon">mdi-clipboard-edit</v-icon>
        <v-list-item-content>Templates</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import {KeepAlive} from 'vue';

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style scoped>
.icon {
  margin: 1rem;
}
.logo {
  margin: 1rem;
}
</style>
