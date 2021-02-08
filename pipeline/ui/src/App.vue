Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
  <v-app>
    <v-app-bar
      app
      color="orange"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/deep-lynx-white.png"
          transition="scale-transition"
          width="40"
        />
        <h1>Pipeline</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/idaholab/NRIC-DE/tree/main/reports-generator/adapters"
        target="_blank"
        text
      >
        <span class="mr-2">GitHub</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Selector/>
    </v-main>
  </v-app>
</template>

<script>
import Selector from './components/Selector';

export default {
  name: 'App',

  components: {
    Selector,
  },

  data: () => ({
    //
  }),
};
</script>
