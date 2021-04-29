<template>
    <v-container>
        {{style}}
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Templates',
    props: {
        //
    },
    data: () => ({
        style: null
    }),
    mounted: async function() {
        this.style = await axios.get('http://localhost:3131/assets/layout.json').then(response => {
            return response.data;
        });
    }
}
</script>