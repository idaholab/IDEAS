<template>
  <v-app id="inspire">
    <app-nav-drawer v-if="$route.name!='Login'"/>
    <app-app-bar v-if="$route.name!='Login'"/>
    <v-main>
      <v-container fluid class="view-container">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {
    appNavDrawer: () => import('../components/menus/NavDrawer'),
    appAppBar: () => import('../components/menus/AppBar')
  },
  props: {
    source: String
  },
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>

<style scoped>
.view-container {
  max-width: 2000px;
}
.fade {
  &-enter {
    opacity: 0;
    &-active {
      transition: opacity .3s;
    }
  }
  &-leave {
    &-active {
      transition: opacity .3s;
      opacity: 0;
    }
  }
}
</style>

<style>
.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important
}

.theme--dark.v-icon {
    color: $primary !important;
}

.height-full {
  height: 100%;
}

.width-full {
  width: 100%;
}

.number-box-display {
  background-color: $secondary;
  padding: 3px 5px 2px 6px;
  letter-spacing: .05rem;
  font-size: .9375rem;
  font-weight: 500;
  border-radius: 2px;
  display: inline;
}
</style>
