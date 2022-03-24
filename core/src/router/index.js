import Vue from 'vue'
import VueRouter from 'vue-router'
// import { IsLoggedIn, LoginFromToken } from '@/auth/authService'

Vue.use(VueRouter)

const routes = [
  {
    path: '/apps/',
    name: 'Applications',
    component: () => import(/* webpackChunkName: "login" */ '../views/Applications.vue'),
    children: [
      {
        path: 'manufacturing',
        name: 'Manufacturing',
        component: () => import(/* webpackChunkName: "home" */ '../views/subviews/applications/Manufacturing.vue')
      },
      {
        path: 'vault-api',
        name: 'Vault API',
        component: () => import(/* webpackChunkName: "home" */ '../views/subviews/applications/VaultAPI.vue')
      },
      {
        path: 'windchill',
        name: 'Windchill',
        component: () => import('../views/subviews/applications/Windchill.vue')
      },
      {
        path: 'innoslate-reports',
        name: 'Innoslate Reports',
        component: () => import('../views/subviews/applications/InnoslateReports.vue')
      },
      {
        path: 'doe-parser',
        name: 'DOE Parser',
        component: () => import('../views/subviews/applications/DOEParser.vue')
      },
    ]
  },
  {
    path: '/adapters/',
    name: 'Adapters',
    // route level code-splitting
    // this generates a separate chunk (settings.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Adapters.vue'),
    children: [

    ]
  },
  {
    path: '/adapters/:name',
    name: 'Adapter',
    props: true,
    component: () => import('../views/subviews/adapters/Adapter.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "home" */ '../views/Settings.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
