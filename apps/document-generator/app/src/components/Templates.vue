<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Layout</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-select
                  label="orientation"
                  :items="options.orientation"
                  v-model="template.document.orientation"
                >
                </v-select>
                <v-text-field
                  label="margin x"
                  v-model="template.document.margins.x"
                ></v-text-field>
                <v-text-field
                  label="margin y"
                  v-model="template.document.margins.y"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Fonts</v-expansion-panel-header>
              <v-expansion-panel-content>
                <section
                  v-for="type of Object.keys(template.fonts)"
                  :key="type"
                >
                  <v-select
                    :label="type"
                    :items="options.fonts"
                    v-model="template.fonts[type]"
                  >
                  </v-select>
                </section>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Styles</v-expansion-panel-header>
              <v-expansion-panel-content>
                <section
                  v-for="style of Object.keys(template.background)"
                  :key="style"
                >
                  <v-file-input
                    :label="style"
                    :name="style"
                    v-model="template.background[style]"
                  >
                  </v-file-input>
                </section>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
        <br />
        <v-btn v-on:click="preview">Preview</v-btn>
      </v-col>

      <v-col>
        <Document v-if="metadata" :metadata="metadata" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Document from "./Document";
import axios from "axios";
import { stylesheetBuilder } from "../api/stylesheet";

export default {
  name: "Templates",
  components: {
    Document,
  },
  props: {
    //
  },
  data: () => ({
    metadata: null,
    options: {
      orientation: ["portrait", "landscape"],
      fonts: [
        "Roboto",
        "Open Sans",
        "Source Sans Pro",
        "Oxygen",
        "Georgia",
        "Helvetica",
        "Ubuntu",
        "Times New Roman",
      ],
    },
    template: {
      document: {
        orientation: undefined,
        margins: {
          x: undefined,
          y: undefined,
        },
      },
      fonts: {
        title: undefined,
        heading: undefined,
        paragraph: undefined,
      },
      background: {
        cover: undefined,
        disclaimer: undefined,
        "table of contents": undefined,
        page: undefined,
      },
    },
  }),
  methods: {
    display() {
      let css = stylesheetBuilder(this.template);
    },
    async preview() {
      let form = new FormData();
      form.append("stylesheet", JSON.stringify(this.template));
      for (let [key, value] of Object.entries(this.template.background)) {
        form.append(key, value);
      }

      this.metadata = { form: form, preview: true };
    },
  },
  watch: {
    // template: {
    //     immediate: true,
    //     handler: 'preview',
    //     deep: true
    // }
  },
};
</script>
