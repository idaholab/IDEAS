import Vue from 'vue'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import ClientPlugin from '@/api/client'
import AuthPlugin from '@/auth/authService'


Vue.config.productionTip = false

Vue.use(ClientPlugin)
Vue.use(AuthPlugin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
