<template>
  <div class="d-flex">
    <v-app-bar
      app
      clipped-left
      flat
    >
      <v-app-bar-nav-icon @click.stop="setDrawer(!drawer)"></v-app-bar-nav-icon>
      <v-toolbar-title
        class="pl-0 mr-4"
        v-if="$route.matched.slice(-2).shift().name"
        v-text="$route.matched.slice(-2).shift().name"
      />
      <v-toolbar-title
        class="pl-0 mr-4"
        v-else-if="$route.name"
        v-text="$route.name"
      />
      <div
        v-if="$route.path.indexOf('/apps') >= 0"
        class="dashboard-controls pl-4 d-flex align-center"
      >

        <!-- Toggle showing current subview page on sizes medium and up -->
        <div
          class="primary--text mr-2"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          Currently Viewing
        </div>
        <v-btn-toggle
          color="primary"
          mandatory
          dark
          dense
          v-if="$route.path.indexOf('/apps') >= 0"
        >
          <v-btn
            value="scenario"
            to="/apps/manufacturing"
            class="dashboard-controls-button"
          >
            Manufacturing
          </v-btn>

          <v-btn
            value="scenario"
            to="/apps/vault-api"
            class="dashboard-controls-button"
          >
            Vault API
          </v-btn>

          <v-btn
            value="scenario"
            to="/apps/windchill"
            class="dashboard-controls-button"
          >
            Windchill
          </v-btn>

          <v-btn
            value="scenario"
            to="/apps/innoslate-reports"
            class="dashboard-controls-button"
          >
            Innoslate Reports
          </v-btn>

          <v-btn
            value="scenario"
            to="/apps/doe-parser"
            class="dashboard-controls-button"
          >
            DOE Parser
          </v-btn>

        </v-btn-toggle>
      </div>

      <v-spacer></v-spacer>

      <deep-lynx-status v-if="$route.name!='Login'" />

    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DeepLynxStatus from '@/../components/deeplynx/DeepLynxStatus'

export default {
  name: 'AppBar',

  components: {
    DeepLynxStatus
  },

  computed: {
    ...mapState(['drawer'])
  },

  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER'
    }),
    async mounted () {
    },

  },

  mounted () {
    this.mounted()
  }
}
</script>

<style>

.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: #3c3c3c;
}

.dashboard-controls {
  border-left: 1px solid white;

  .theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    border: none;
    padding-left: 30px;
    padding-right: 30px;

    &:hover {
      background: none;
      transition: all .2s ease-in-out;
    }

    &::before, &:focus::before  {
      opacity: 0 !important;
    }

    &.v-item--active.v-btn--active {
      background: none;
      color: white;
      transition: all .3s ease-in-out;
    }
  }
}
</style>
