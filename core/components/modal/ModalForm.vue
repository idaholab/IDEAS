<template>
  <div class="modal-backdrop">
    <div class="modal">

      <header class="modal-header">
        <div class="header-content">
          <div class="header-title">
            <slot name="header">
              Title
            </slot>
          </div>
          <div class="angle"></div>
        </div>
        <v-icon class="icon-close" @click="close">mdi-close</v-icon>
      </header>

      <section class="modal-body">
        <slot name="body">
          Body
        </slot>
       </section>

      <footer class="modal-footer">
        <button
          style="color:white;"
          type="button"
          @click="close"
        >
          <strong>Close</strong>
        </button>
        <button
          style="color:#4ebf94;"
          type="button"
          @click="onSubmit"
        >
          <strong>Submit</strong>
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalForm',
    methods: {
      close() {
        this.$emit('close');
      },
      onSubmit() {
        this.$emit('submit', true);
      }
    },
  };
</script>

<style lang="scss">

.modal-backdrop {
  position: fixed !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: #1E1E1E;
  overflow-x: auto;
  max-height: calc(100vh - 10em);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 900px;
}

.modal-footer {
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #3c3c3c;
}

.modal-header {
  display: flex;
  width: 99%;
}

.header-content {
  font-size: 120%;
  padding: 0;
  max-width: 500px;
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  justify-content: space-between;
  width: 100%;
  font-size: 1rem;
  background: #3c3c3c;
  text-overflow: ellipsis;
  color: #ffffff !important;
}

.header-title {
  margin: 1rem;
  font-size:120%
}

.angle {
  margin-left: -.125rem;
  width: 1rem;
  height: 3.8rem;
  border-bottom: 3.8rem solid #1e1e1e;
  border-left: 1rem solid #3c3c3c;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  color: #4ebf94 !important;
  background: #1e1e1e !important;
}

.btn-close {
  color: white !important;
}

.icon-close {
  margin-left: auto;
  padding-right:1rem;
}

.btn-green {
  color: #4ebf94 !important;
}

.button {
  display: block !important;
  border: 3px solid #4ebf94 !important;
}

</style>
