<template>
  <div class="app_message">
    <transition name="slide" mode="out-in">
      <div :class="messageClass" :key="message">
        {{ message }}<v-icon v-if="message!=''" class="icon-close" @click="close">mdi-close</v-icon>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'LocalMessage',
  components: {
  },
  data: () => ({
  }),
  props: {
    message: String,
    messageClass: String
  },
  methods: {
    close() {
      this.message = ''
      this.messageClass = ''
    }
  }
}
</script>

<style scoped>
.app_message {
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
  color: white;
}

.message_success {
  background-color:#4ebf94;
  padding: 0.5rem;
  display: flex;
  color: white;
}

.icon-close {
  margin-left: auto;
}

</style>
