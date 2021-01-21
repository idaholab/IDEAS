Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

<template>
    <UI />
</template>

<script>
import UI from './components/UI';


export default {
    name: "App",
    components: {
        UI
    },
    data() {
        return {
            nameString: this.nameString
        };
    }
}
</script>