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
        :style="selected ? 'stroke:blue;': 'stroke:black;'"
        :stroke-width="stroke_width"
        v-on:click="sendID(id)"
    />;
  </a>
</template>

<script>
export default {
  name: 'ArcObj',
  props: {
    arc_obj: Object,
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
      return this.arc_obj.index;
    },
    start_x() {
      let center_x = this.get_x(this.arc_obj.center[0]);
      let radius_x = this.arc_obj.radius;
      let start_angle = this.arc_obj.start_angle;
      return center_x + (radius_x * Math.cos(start_angle));
    },
    start_y() {
      let center_y = this.get_y(this.arc_obj.center[1]);
      let radius_y = this.arc_obj.radius;
      let start_angle = this.arc_obj.start_angle;
      return center_y + (radius_y * Math.sin(start_angle));
    },
    radius_x() {
      return this.arc_obj.radius;
    },
    radius_y() {
      return this.arc_obj.radius;
    },
    end_x(){
      let center_x = this.get_x(this.arc_obj.center[0]);
      let radius_x = this.arc_obj.radius;
      let end_angle = this.arc_obj.end_angle;
      return center_x + (radius_x * Math.cos(end_angle));
    },
    end_y(){
      let center_y = this.get_y(this.arc_obj.center[1]);
      let radius_y = this.arc_obj.radius;
      let end_angle = this.arc_obj.end_angle;
      return center_y + (radius_y * Math.sin(end_angle));
    },
    x_rotation() {
      let x_rotation = 0;
      if (this.arc_obj.start_angle > this.arc_obj.end_angle) {
        x_rotation = 1;
      }
      return x_rotation;
    },
    large_arc_flag() {
      return 0;
    },
    sweep_flag() {
      return 0;
    },
    stroke_width() {
      return this.get_stroke(this.arc_obj.linewt);
    },
    // selected() {
    //   return this.arc_obj.selected;
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
path {
  pointer-events: auto;
}
</style>
