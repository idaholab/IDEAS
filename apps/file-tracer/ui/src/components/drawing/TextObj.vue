<template>
  <a class="shell">
    <text :id="id"
      :x="x" :y="y" :style="text_style">{{text}}</text>;
  </a>
</template>

<script>
export default {
  name: 'TextObj',
  props: {
    text_obj: Object,
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
      return this.text_obj.index;
    },
    x() {
      return this.get_x(this.text_obj.ins_pt[0]);
    },
    y() {
      return this.get_y(this.text_obj.ins_pt[1]);
    },
    text() {
      return this.filter_text(this.text_obj.text);
    },
    text_style() {
      return this.make_style(
        this.text_obj.text,
        this.text_obj.size,
        this.text_obj.text_height
      )
    }
  },
  methods: {
    get_x(x) {
      return x - this.x_offset;
    },
    get_y(y) {
      return this.actual_height - y + this.y_offset;
    },
    get_stroke(width, scalar=2) {
      let scale = Math.max(this.doc_width / this.actual_width, this.doc_height / this.actual_height) * 150;
      return (width / scale) * scalar;
    },
    filter_text(text) {
      let clean_text = text;
      // remove open bracket
      if (clean_text.charAt(0) == "{") {
        clean_text = clean_text.substring(1);
      }
      // remove close bracket
      if (clean_text.charAt(clean_text.length - 1) == "}") {
        clean_text = clean_text.substring(0, clean_text.length - 1);
      }
      // remove text decorators
      if (clean_text.substring(0,4) == "\\A1;") {
        clean_text = clean_text.substring(4, clean_text.length);
      }
      if (clean_text.substring(0,2) == "\\L") {
        clean_text = clean_text.substring(2, clean_text.length);
      }
      return clean_text;
    },
    make_style(text,size,height) {
      let scalar = 1;
      let style='font-family:Arial,sans-serif;';
      if (text.substring(1,3) == "\\L") {
        style += "text-decoration:underline;"
      }
      if (text.substring(0,4) == "\\A1;") {
        scalar = 1.5;
      }
      style += `font-size:${(size / 48) * (height / 2) * scalar};`;
      return style;
    },
  }
}
</script>

<style>

</style>
