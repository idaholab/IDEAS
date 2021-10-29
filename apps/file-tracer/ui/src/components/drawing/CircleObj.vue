<template>
  <a class="shell">
    <circle :id="id"
      class="selectable"
      :cx="center_x" :cy="center_y" :r="radius"
      fill="none"
      style="stroke:black;"
      :stroke-width="stroke_width"
      v-on:click="sendID(id)"
    />;
  </a>
</template>

<script>
export default {
  name: 'CircleObj',
  props: {
    circle_obj: Object,
    x_offset: Number,
    y_offset: Number,
    doc_width: Number,
    doc_height: Number,
    actual_width: Number,
    actual_height: Number
  },
  data: () => ({
  }),
  computed: {
    id() {
      return this.circle_obj.index;
    },
    center_x() {
      let center_x = this.get_x(this.circle_obj.center[0]);
      return center_x;
    },
    center_y() {
      let center_y = this.get_y(this.circle_obj.center[1]);
      return center_y;
    },
    radius() {
      return this.circle_obj.radius;
    },
    stroke_width() {
      return this.get_stroke(this.circle_obj.linewt);
    }

  },
  methods: {
    sendID(idx) {
      if (this.selected) {
        this.selected = false;
        this.$emit('unclicked', idx);
      } else {
        this.selected = true;
        this.$emit('clicked', idx);
      }
    },
    get_x(x) {
      return x - this.x_offset;
    },
    get_y(y) {
      return this.actual_height - y + this.y_offset;
    },
    get_stroke(width, scalar=2) {
      let scale = Math.max(this.doc_width / this.actual_width, this.doc_height / this.actual_height) * 150;
      return (width / scale) * scalar;
    }
  }
}
</script>

<style>
path {
  pointer-events: auto;
}
</style>
