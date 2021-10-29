import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        deeplynx: {
            open: false,
            auth: null,
            containers: null,
            metatypes: null,
            nodes: null,
            selection: {
                container: null,
                nodes: null
            }
        },
        document: null
    },
    mutations: {
        open(state, open) {
            state.deeplynx.open = open;
        },
        auth(state, token) {
            state.deeplynx.auth = token;
        },
        containers(state, containers) {
            state.deeplynx.containers = containers;
        },
        nodes(state, nodes) {
            state.deeplynx.nodes = nodes;
        },
        select(state, selection) {
            state.deeplynx.selection[`${selection.key}`] = selection.value;
        },
        document(state, document) {
            state.document = document;
        }
    },
    getters: {
        auth: state => state.deeplynx.auth,
        open: state => state.deeplynx.open,
        containers: state => state.deeplynx.containers,
        nodes: state => state.deeplynx.nodes,
        select: state => state.deeplynx.selection,
        document: state => state.document
    }
})