<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      clipped
      dark
      v-bind="$attrs"
      width="600"
    >
      <div class="mx-5 mt-5">
        <h3>Engineering Application</h3>
        <v-divider class="my-4"></v-divider>
        <span class="d-block">{{ user.name }}Username</span>
        <span class="d-block text-h6" style="line-height: .875rem">{{ user.email }}Email</span>
        <v-divider class="mt-5 mb-1"></v-divider>
      </div>
      <v-list class="nav-drawer-accordion" dense>

        <v-list-item link to="/">
          <v-list-item-action class="mr-2">
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/apps/manufacturing">
          <v-list-item-action class="mr-2">
            <v-icon>mdi-application-braces</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Applications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/adapters">
          <v-list-item-action class="mr-2">
            <v-icon>mdi-database-arrow-up</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Adapters</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/settings">
          <v-list-item-action class="mr-2">
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="logout()">
          <v-list-item-action class="mr-2">
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <template v-slot:append>
        <v-container class="justify-end pa-5">
          <span>&copy; 2021 Idaho National Laboratory</span>
        </v-container>
      </template>

    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavDrawer',

  data: () => ({
    user: {
      name: '',
      email: ''
    }
  }),

  computed: {
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.commit('SET_DRAWER', val)
      }
    }
  },

  methods: {
    logout () {
      this.$auth.Logout()
      window.location.href = `/logout`
    }
  },

  mounted () {
    if (localStorage.user) {
      const user = JSON.parse(localStorage.user)
      this.user.name = user.display_name
      this.user.email = user.email
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-tile {
  margin: 5px 20px;
}

.tile,
.sub-tile {

  &:hover {
    background: white;
  }

  &.v-list-item--active {
    background: white;
    color: #ffffff;
  }
}

.v-list-group {

  &--active {
    background: darken(black, 8%);
    padding-bottom: .1px;
  }

  & ::v-deep .v-list-group__header {

    &:hover:before {
      opacity: .08;
    }

    &.v-list-item--active {
      background: #363636;
      color: #ffffff;
    }
  }
}
</style>
