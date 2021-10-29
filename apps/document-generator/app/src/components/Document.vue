<template>
  <div>
    <object
      class="pdf"
      :data="this.url"
      zoom="65%"
      type="application/pdf"
      height="800px"
    ></object>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Document",
  props: {
    state: Object,
    metadata: Object,
    stylesheet: Object,
    template: Object,
  },
  data: () => ({
    error: null,
    url: null,
  }),
  methods: {
    async generatePdf() {
      this.url = null;
      try {
        await axios
          .post(`http://localhost:3232/generate/pdf`, {
            id: this.metadata.document.id,
            title: this.metadata.document.properties.name,
            nodes: this.metadata.nodes,
            stylesheet: this.stylesheet,
          })
          .then((response) => {
            if (response.status === 200) {
              this.url = this.generate_url();
              console.log(this.url);
              this.$emit("render");
            } else {
              throw new Error(response.data);
            }
          });
      } catch (error) {
        console.log(error);
      }
    },
    async previewPdf() {
      this.url = null;
      await axios
        .post("http://localhost:3232/generate/preview", this.metadata.form, {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${this.metadata.form._boundary}`,
          },
        })
        .then((response) => {
          this.url = this.preview_url();
        });
    },
    generate_url() {
      return `http://localhost:3232/assets/${this.metadata.document.id}.pdf`;
    },
    preview_url() {
      return `http://localhost:3232/assets/preview/preview.pdf`;
    },
  },
  watch: {
    "metadata.document": {
      handler: "generatePdf",
    },
    "metadata.form": {
      handler: "previewPdf",
    },
  },
  mounted: async function () {
    console.log(this.metadata);
    if (this.metadata.generate) {
      await this.generatePdf();
    } else if (this.metadata.preview) {
      await this.previewPdf();
    }
  },
};
</script>

<style scoped>
.html {
  padding: 2.5rem;
}
.pdf {
  position: fixed;
  height: 80vh;
  width: 35vw;
}
</style>
