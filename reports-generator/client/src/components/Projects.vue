Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
    <table id="projectList" style="width:1000px">
        <template v-for="project in projects">
            <tr :key="project.id">
                <td>{{project.name}}</td>
                <td><v-btn v-on:click="getDocuments(project.id)" text small color="#2BA8E0">Get Documents</v-btn></td>
            </tr>
            <template v-if="project.documents.length"><Documents v-bind:documents="documents" v-bind:nameString="nameString" :key="'document'+project.id"/></template>

        </template>


    </table>
</template>


<script>
import Documents from './Documents';
import {getDocuments} from '../utils/utils';

export default {
    name: "Projects",
    components: {
        Documents
    },
    methods: {
        getDocuments: async function(projId) {
            this.documents = await getDocuments(projId);

            for (let i in this.projects) {
                if(this.projects[i].id == projId) {
                    this.projects[i].documents = this.documents;
                } else {
                    this.projects[i].documents = [];
                }
            }
        }
    },
    props: {
        projects: Array,
        nameString: String
    },
    data: function() {
        return {
            documents: []
        }
    }
}
</script>
