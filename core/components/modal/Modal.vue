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
          type="button"
          @click="close"
        >
          <strong>Close</strong>
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

<style lang="scss">

.modal-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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

.icon-close {
  margin-left: auto;
  padding-right:1rem;
}

.btn-green {
  color: white;
  background: #4ebf94;
  border: 1px solid #4ebf94;
  border-radius: 2px;
}

.button {
  display: block !important;
}

</style>
