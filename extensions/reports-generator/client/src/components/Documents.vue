Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
    <tr>
        <td colspan="2">
            <table>
                <tr>
                  <th>Documents</th><th colspan="2">Formats</th>
                </tr>
                <tr v-for="document in documents" :key="document.id">
                    <td>
                        {{document.name}}
                    </td>
                    <td><v-btn v-on:click="makeReport(document.id, document.name, 'NRIC', nameString, isOUO)" text small color="#8DC340">NRIC Doc</v-btn></td>
                    <td><v-btn v-on:click="makeReport(document.id, document.name, 'MFC', nameString, isOUO)" text small color="#F68C20">MFC Doc</v-btn></td>
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
        nameString: String,
        isOUO: Boolean
    },
    methods: {
        makeReport: async function(docId, docName, docType, nameString, isOUO) {
            await makeReport(docId, docName, docType, nameString, isOUO);
        }
    }
}
</script>
