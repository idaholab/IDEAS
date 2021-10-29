<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <h2>
          <slot name="header">
            Title
          </slot>
        </h2>
        <button
          type="button"
          class="btn-close"
          @click="close"
        >
          <v-icon>mdi-close-outline</v-icon>&nbsp;&nbsp;
        </button>
      </header>

      <section class="modal-body">
        <slot name="body">
          Body
        </slot>
       </section>

      <footer class="modal-footer">
        <button
          type="button"
          @click="close"
        >
          Close
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style>

.modal-backdrop {
  position: fixed;
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
  background: #FFFFFF;
  overflow-x: auto;
  max-height: calc(100vh - 10em);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 80%;
  border-radius: 0.25em;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  justify-content: space-between;
  width: 100%;
  font-size: 1rem;
  padding: .25rem .75rem .25rem 1rem;
  background: #3c3c3c;
  text-overflow: ellipsis;
  color: #ffffff !important;
}

.modal-footer {
  flex-direction: column;
  justify-content: flex-end;
  background: #3c3c3c;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  color: #121212;
  background: #1e1e1e !important;
}

.btn-close {
  position: absolute;
  top: -0.4rem;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4ebf94;
  border: 1px solid #4ebf94;
  border-radius: 2px;
}

</style>
