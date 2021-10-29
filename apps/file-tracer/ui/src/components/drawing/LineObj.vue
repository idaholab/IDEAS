<template>
  <a class="shell">
    <path :id="id"
      class="selectable"
      :d="'M ' + start_x + ' ' + start_y +
      ' ' + 'L ' + end_x + ' ' + end_y"
      fill="none"
      :stroke-width="stroke_width"
      style="stroke:black;"
      v-on:click="sendID(id)"
    />
  </a>
</template>

<script>
export default {
  name: 'LineObj',
  props: {
    line_obj: Object,
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
      return this.line_obj.index;
    },
    start_x() {
      return this.get_x(this.line_obj.start[0]);
    },
    start_y() {
      return this.get_y(this.line_obj.start[1]);
    },
    end_x() {
      return this.get_x(this.line_obj.end[0]);
    },
    end_y() {
      return this.get_y(this.line_obj.end[1]);
    },
    stroke_width() {
      return this.get_stroke(this.line_obj.linewt);
    },
    // selected() {
    //   return this.line_obj.selected;
    // }
  },
  methods: {
    sendID(idx) {
      this.$emit('clicked', idx);
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
