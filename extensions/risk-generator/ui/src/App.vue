<template>
  <v-app>
    <v-app-bar app dark>
      <h1>Risk Generator</h1>
      <v-spacer></v-spacer>
      <v-btn
        href="https://gitlab.software.inl.gov/b650/nric-de/-/tree/main/extensions/risk-generator"
        target="_blank"
        text>
        <v-icon>mdi-gitlab</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Generator />
    </v-main>
  </v-app>
</template>

<script>
import Generator from './components/Generator';

export default {
  name: 'App',
  components: {
    Generator,
  },
  data: () => ({
    //
  }),
};
</script>
