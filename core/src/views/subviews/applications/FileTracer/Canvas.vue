<template>

  <div class="canvas" :style="cssVars">
    <!--svg width="100%" :viewBox="viewBoxVars"-->
      <Objects
        :viewBoxVars="viewBoxVars"
        :file_obj_objects="file_obj.OBJECTS"
        :x_offset="x_offset"
        :y_offset="y_offset"
        :doc_width="doc_width"
        :doc_height="doc_height"
        :actual_width="actual_width"
        :actual_height="actual_height"
        @clicked="sendID"
        @unclicked="removeID"
        @clearCanvas="clearCanvas"
      />
    <!--/svg-->
  </div>

</template>

<script>
import Objects from './Objects.vue'
export default {
  name: 'Canvas',
  components: {
    Objects
  },
  props: {
    file_obj: Object,
    max_width: Number
  },
  methods: {
    sendID(idx) {
      this.$emit('clicked', idx);
    },
    removeID(idx) {
      this.$emit('unclicked', idx);
    },
    clearCanvas() {
      this.$emit('clearCanvas', true);
    }
  },
  data: () => ({
    scale: 1,
    doc_width: 0,
    doc_height: 0,
    actual_width: 0,
    actual_height: 0,
    x_offset: 0,
    y_offset: 0,
  }),
  mounted: function() {

    let mins = this.file_obj.HEADER.EXTMIN;
    let maxes = this.file_obj.HEADER.EXTMAX;

    let margin_fraction = 0.2

    this.doc_width = maxes[0] - mins[0];
    this.doc_height = maxes[1] - mins[1];

    this.x_offset = mins[0] * (1 + margin_fraction);
    this.y_offset = mins[1] * (1 + margin_fraction);

    this.actual_width = this.doc_width * (1 + margin_fraction / 2);
    this.actual_height = this.doc_height * (1 + margin_fraction / 2);
  },
  computed: {
    cssVars() {
      return {
        width: `100%`,
        height: `auto`
      }
    },
    viewBoxVars() {
      return `0 0 ${this.actual_width} ${this.actual_height}`
    }
  }
}
</script>

<style scoped>
.canvas {
  background: #ECECEC;
  border-radius: .175rem;
}
</style>
