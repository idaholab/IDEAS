// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

import Vue from 'vue';
import App from './App';
import {getTemplates} from "./utils/utils";
import vuetify from './plugins/vuetify';

const app = new Vue({
    el: '#app',
    components: {App},
    vuetify,
    data: {
        projects: [],
        document_templates: []
    },
    mounted: function() { 
        this.document_templates = getTemplates();
      },
    render: h => h(App)
});
