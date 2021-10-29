
class DWG2SVG {

  constructor(
    x_offset, y_offset,
    doc_width, doc_height,
    actual_width, actual_height
  ) {
    this.x_offset = x_offset;
    this.y_offset = y_offset;
    this.doc_width = doc_width;
    this.doc_height = doc_height;
    this.actual_width = actual_width;
    this.actual_height = actual_height;
  }

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

module.exports = DWG2SVG
