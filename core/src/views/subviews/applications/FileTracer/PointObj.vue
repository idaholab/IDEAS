<template>
  <a class="shell">
    <circle :id="id"
      class="selectable"
      :cx="center_x" :cy="center_y"
      v-bind:r="stroke_width"
      :stroke-width="stroke_width"
      :style="selected ? 'fill:blue;': 'fill:black;'"
      v-on:click="sendID(id)"/>`;
  </a>
</template>

<script>
export default {
  name: 'PointObj',
  props: {
    point_obj: Object,
    x_offset: Number,
    y_offset: Number,
    doc_width: Number,
    doc_height: Number,
    actual_width: Number,
    actual_height: Number
  },
  data: () => ({
    selected: false
  }),
  computed: {
    id() {
      return this.point_obj.index;
    },
    center_x() {
      return this.get_x(this.point_obj.x);
    },
    center_y() {
      return this.get_y(this.point_obj.y);
    },
    stroke_width() {
      return this.get_stroke(parseFloat(this.point_obj.linewt));
    },
    // selected() {
    //   return this.point_obj.selected;
    // }
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
circle {
  pointer-events: auto;
}
</style>
