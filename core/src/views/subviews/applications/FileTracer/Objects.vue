<template>
    <svg width="100%" :viewBox="viewBoxVars">
      <LineObj v-for="line in parsedObjects.lines"
        v-bind:key="line.index" v-bind:line_obj="line"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID"/>
      <PolyObj v-for="polyline in parsedObjects.polylines"
        v-bind:key="polyline.index" v-bind:polyline_obj="polyline"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID"/>
      <ArcObj v-for="arc in parsedObjects.arcs"
        v-bind:key="arc.index" v-bind:arc_obj="arc"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID" @unclicked="removeID"/>
      <CircleObj v-for="circle in parsedObjects.circles"
        v-bind:key="circle.index" v-bind:circle_obj="circle"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID" @unclicked="removeID"/>
      <EllipseObj v-for="ellipse in parsedObjects.ellipses"
        v-bind:key="ellipse.index" v-bind:ellipse_obj="ellipse"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID" @unclicked="removeID"/>
      <Poly2DObj v-for="polyline in parsedObjects.polylines2D"
        v-bind:key="polyline.index" v-bind:curve_obj="polyline.root"
        v-bind:vertices="polyline.vertices"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID"/>
      <PointObj v-for="point in parsedObjects.points"
        v-bind:key="point.index" v-bind:point_obj="point"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"
        @clicked="sendID" @unclicked="removeID"/>
      <TextObj v-for="text in parsedObjects.texts"
        v-bind:key="text.id" v-bind:text_obj="text"
        :x_offset="x_offset" :y_offset="y_offset"
        :doc_width="doc_width" :doc_height="doc_height"
        :actual_width="actual_width" :actual_height="actual_height"/>
      <circle cx="97.5%" cy="5%" r="1px"
        stroke-width="2" stroke="black" v-on:click="clearCanvas"/>
    </svg>

</template>

<script>
import LineObj from './LineObj.vue';
import PolyObj from './PolyObj.vue';
import Poly2DObj from './Poly2DObj.vue';
import ArcObj from './ArcObj.vue';
import CircleObj from './CircleObj.vue';
import EllipseObj from './EllipseObj.vue';
import PointObj from './PointObj.vue';
import TextObj from './TextObj.vue';

export default {
  name: 'Objects',
  components: {
    LineObj,
    PolyObj,
    Poly2DObj,
    ArcObj,
    CircleObj,
    EllipseObj,
    PointObj,
    TextObj
  },
  props: {
    viewBoxVars: String,
    file_obj_objects: Array,
    x_offset: Number,
    y_offset: Number,
    doc_width: Number,
    doc_height: Number,
    actual_width: Number,
    actual_height: Number
  },
  data: () => ({
  }),
  methods: {
    // Data aggregations
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
  mounted: function() {
  },
  computed: {
    parsedObjects() {
      let parsedObjs = {
        "lines": [],
        "polylines": [],
        "polylines2D": [],
        "arcs": [],
        "circles": [],
        "ellipses": [],
        "points": [],
        "texts": []
      };

      let temp_polyline2D = {
        root: null,
        vertices: []
      };

      let obj_dict = {};

      for (var i=0;i<this.file_obj_objects.length;i++) {
        let obj = this.file_obj_objects[i];
        if ('entity' in obj) {

          if (obj.entity == "LINE") {
            parsedObjs.lines.push(obj);
          } else if (obj.entity == "LWPOLYLINE") {
            parsedObjs.polylines.push(obj);
          } else if (obj.entity == "POLYLINE_2D") {  // start temp_poly construction
            temp_polyline2D.root = obj;
          } else if (obj.entity == "VERTEX_2D") {  // add to temp_poly vertices
            temp_polyline2D.vertices.push(obj);
          } else if (obj.entity == "SEQEND") {  // close out temp_poly obj
            parsedObjs.polylines2D.push(temp_polyline2D);
            temp_polyline2D = {
              root: null,
              vertices: []
            };
          } else if (obj.entity == "ARC") {
            parsedObjs.arcs.push(obj);
          } else if (obj.entity == "CIRCLE") {
            parsedObjs.circles.push(obj);
          } else if (obj.entity == "ELLIPSE") {
            parsedObjs.ellipses.push(obj);
          } else if (obj.entity == "POINT") {
            parsedObjs.points.push(obj);
          } else if (obj.entity == "MTEXT") {
            parsedObjs.texts.push(obj);
          }


          // used for testing TODO: remove
          if (obj.entity in obj_dict) {
            obj_dict[obj.entity] += 1;
          } else {
            obj_dict[obj.entity] = 1;
          }

        }
      }
      console.log(obj_dict);
      return parsedObjs;
    }
  }
}
</script>

<style>
.shell {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
}

.activeStyle {
  stroke: "blue";
}

.inactiveStyle {
  stroke: "black";
}
</style>
