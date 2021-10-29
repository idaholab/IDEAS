<template>
  <a class="shell">
    <path :id="id"
      class="selectable"
      :d="'M ' + start_x + ' ' + start_y +
          ' A ' + radius_x + ' ' + radius_y + ', ' +
          x_rotation + ', ' +
          large_arc_flag + ', ' + sweep_flag + ', ' +
          end_x + ' ' + end_y"
        fill="none"
        style="stroke:black;'"
        :stroke-width="stroke_width"
        v-on:click="sendID(id)"
    />;
    <!-- <ellipse :id="id"
      :cx="center_x" :cy="center_y"
      :rx="radius_x"  :ry="radius_y"
      fill="none"
      style="stroke:black;'"
      :stroke-width="stroke_width"
      v-on:click="sendID(id)"
    /> -->
  </a>
</template>

<script>
export default {
  name: 'EllipseObj',
  props: {
    ellipse_obj: Object,
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
      return this.ellipse_obj.index;
    },
    center_x() {
      let center_x = this.get_x(this.ellipse_obj.center[0]);
      return center_x;
    },
    center_y() {
      let center_y = this.get_y(this.ellipse_obj.center[1]);
      return center_y;
    },
    start_x() {
      let center_x = this.get_x(this.ellipse_obj.center[0]);
      let radius_x = Math.abs(this.ellipse_obj.sm_axis[0]);
      let start_angle = this.ellipse_obj.start_angle;
      return center_x + (radius_x * Math.cos(start_angle));
    },
    start_y() {
      let center_y = this.get_y(this.ellipse_obj.center[1]);
      let radius_y = Math.abs(this.ellipse_obj.sm_axis[0]) * this.ellipse_obj.axis_ratio;
      let start_angle = this.ellipse_obj.start_angle;
      return center_y + (radius_y * Math.sin(start_angle));
    },
    radius_x() {
      return Math.abs(this.ellipse_obj.sm_axis[0]);
    },
    radius_y() {
      return Math.abs(this.ellipse_obj.sm_axis[0]) * this.ellipse_obj.axis_ratio;
    },
    end_x(){
      let center_x = this.get_x(this.ellipse_obj.center[0]);
      let radius_x = Math.abs(this.ellipse_obj.sm_axis[0]);
      let end_angle = this.ellipse_obj.end_angle;
      return center_x + (radius_x * Math.cos(end_angle));
    },
    end_y(){
      let center_y = this.get_y(this.ellipse_obj.center[1]);
      let radius_y = Math.abs(this.ellipse_obj.sm_axis[0]) * this.ellipse_obj.axis_ratio;
      let end_angle = this.ellipse_obj.end_angle;
      return center_y + (radius_y * Math.sin(end_angle));
    },
    x_rotation() {
      let x_rotation = 0;
      return x_rotation;
    },
    large_arc_flag() {
      return 0;
    },
    sweep_flag() {
      if (this.ellipse_obj.sm_axis[0] < 0) {
        return 1;
      }
      return 0;
    },
    stroke_width() {
      return this.get_stroke(this.ellipse_obj.linewt);
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
