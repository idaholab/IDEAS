Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
    <tr>
        <td colspan="2">
            <table>
                <tr v-for="document in documents" :key="document.id">
                    <td>
                        {{document.name}}
                    </td>
                    <td><v-btn v-on:click="makeReport(document.id, document.name, 'NRIC', nameString)" text small color="#8DC340">NRIC Doc</v-btn></td>
                    <td><v-btn v-on:click="makeReport(document.id, document.name, 'MFC', nameString)" text small color="#F68C20">MFC Doc</v-btn></td>
                </tr>
            </table>
        </td>
    </tr>
</template>


<script>
import {makeReport} from '../utils/utils';

export default {
    name: "Documents",
    props: {
        documents: Array,
        nameString: String
    },
    methods: {
        makeReport: async function(docId, docName, docType, nameString) {
            await makeReport(docId, docName, docType, nameString);
        }
    }
}
</script>