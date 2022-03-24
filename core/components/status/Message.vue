<template>
  <div id="app_message">
    <transition name="slide" mode="out-in">
      <div :class="messageClass" :key="message">
        {{ message }}<v-icon v-if="message!=''" class="icon-close" @click="close">mdi-close</v-icon>
      </div>
    </transition>
  </div>
</template>

<script>
import store from '@/store/index.js'
export default {
  name: 'Message',
  components: {
  },
  data: () => ({
  }),
  computed: {
    message() {
      if (store.getters.message_text != '') {
        return store.getters.message_text;
      } else {
        return '';
      }
    },
    messageClass() {
      return store.getters.message_type
    }
  },
  methods: {
    close() {
      store.commit('set_message_text', '');
      store.commit('set_message_type', '');
    }
  }
}
</script>

<style scoped>
#app_message {
  font-family: 'Montserrat';
  height: 2rem;
  width: 100%;
}

.slide-enter-active, .slide-leave-active {
  transition: opacity .5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.message_error {
  background-color:#8C1823;
  padding: 0.5rem;
  display: flex;
}

.message_success {
  background-color:#4ebf94;
  padding: 0.5rem;
  display: flex;
}

.icon-close {
  margin-left: auto;
}

</style>
