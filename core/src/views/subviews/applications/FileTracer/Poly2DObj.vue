<template>
  <a class="shell">
    <polyline :id="id"
      class="selectable"
      :points="points"
      fill="none"
      :stroke-width="stroke_width"
      v-on:click="sendID(id)"
      style="stroke:black;"
    />
  </a>
</template>

<script>
export default {
  name: 'Poly2DObj',
  props: {
    curve_obj: Object,
    vertices: Array,
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
      return this.curve_obj.index;
    },
    points() {
      let points_string = "";
      let x = 0;
      let y = 0;
      for (var j=0;j<this.vertices.length;j++) {
        x = this.get_x(this.vertices[j].point[0]);
        y = this.get_y(this.vertices[j].point[1]);
        points_string += `${x},${y} `;
      }
      return points_string;
    },
    stroke_width() {
      return this.get_stroke(this.curve_obj.linewt);
    },
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
polyline {
  pointer-events: auto;
  stroke-linejoin: round;
}
</style>
