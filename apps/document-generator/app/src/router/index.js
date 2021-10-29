import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import DeepLynx from '../components/DeepLynx.vue';
import Templates from '../components/Templates.vue';

Vue.use(Router);

const routes = [
    {
        path: '/', 
        name: "Home",
        component: Home
    },
    {
        path: '/deeplynx',
        name: "DeepLynx",
        component: DeepLynx
    },
    {
        path: '/templates',
        name: "Templates",
        component: Templates
    }
]

export default new Router({
    routes
})