<template>
  <div>
    <div :style="indent">
      <span v-if="child_count > 0">
        <span v-if="showChildren">
          <v-icon color="#4ebf94" small>mdi-minus-circle-outline</v-icon>
        </span>
        <span v-else>
          <v-icon color="#4ebf94" small>mdi-plus-circle-outline</v-icon>
        </span>
      </span>
      <span class="folder_name" @click="toggleChildren">
        {{ name }}
      </span>
      &nbsp;
      <input
        type="radio"
        name="folder_id"
        :value="ident"
        :id="ident"
        v-model="folder_id"
        v-on:change="setFolder"
      />
    </div>
    <div v-if="showChildren">
      <TreeSelector
        v-for="node in nodes"
        :nodes="node.Folders"
        :ident="node.ID"
        :name="node.Name"
        :depth="depth + 1"
        :key="node.ID"
        @bus="bus"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeSelector',
  components: {
  },
  props: {
    ident: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nodes: {
      type: Array,
      required: false
    },
    depth: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      showChildren: false
    }
  },
  methods: {
    toggleChildren() {
      this.showChildren = !this.showChildren;
      if (this.showChildren == false) {
        this.alertCollapse()
      }
    },
    bus(data) {
      this.$emit('bus', data)
    },
    setFolder() {
      this.$emit('bus', {
        'ident': this.ident,
        'name': this.name
      })
    },
    alertCollapse() {
      this.$emit('bus', {
        "collapse": true
      })
    }
  },
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 1.5}rem)`}
    },
    child_count() {
      return this.nodes.length
    }
  }
}
</script>

<style scoped>
.folder_name {
  cursor: pointer !important;
}

i.v-icon.v-icon {
  top: -0.1rem;
}
</style>
