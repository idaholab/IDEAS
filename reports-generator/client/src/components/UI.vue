Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
    <v-app>
        <v-main>
            <v-container>
                <h1>Reports Generator</h1>

                <v-spacer>
                    <br />
                </v-spacer>

                <input type="text" id="nameString" v-model="nameString" placeholder="Name">
                <button type="button" @click="addName">ADD</button>
                <ul>
                    <li v-for="name in nameArray">{{ name }}</li>
                </ul>
                <br />
                <br />
                <br />
                <v-btn v-if="!this.projects.length" v-on:click="getProjects" text small color="#07519E">Get NRIC Projects</v-btn>

                <template v-if="this.projects.length">
                    <Projects v-bind:projects="projects" v-bind:nameString="nameConcat"/>
                </template>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Projects from './Projects'
import {getProjects, getTemplates} from '../utils/utils';

export default {
    name: "UI",
    components: {
        Projects
    },
    methods: {
        getProjects: async function() {
            this.projects = await getProjects();
        },
        addName: function() {
            if (!this.nameString) {
                return;
            }
            //this.nameList += this.nameString + "|";
            this.nameArray.push(this.nameString)
            this.nameConcat = this.nameArray.join("|")
            this.nameString = '';
            //alert(this.nameList);
        }
    },
    data: function() {
        return {
            projects: [],
            templates: [],
            nameString: '',
            nameConcat: '',
            nameArray: []
        }
    },
    mounted: function() {
        this.templates = getTemplates();
    }
}
</script>
