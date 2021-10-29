import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#4ebf94',
        success: '#4ebf94',
        secondary: '#3c3c3c',
        // accent: '#8c9eff',
        error: '#ff5252'
      }
    }
  }
})
