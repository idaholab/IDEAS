<template>
  <Card class="button_form" icon="mdi-auto-fix" cardTitle="Automation Actions">
    <DocumentAllocator :containerId="containerId" :folderId="folderId" :folderName="folderName" :authString="authString" />
    <ChangeOrderPusher :containerId="containerId" :folderId="folderId" :folderName="folderName" :authString="authString" />
  </Card>
</template>

<script>
import Card from '@/../components/card/Card.vue'
import DocumentAllocator from './FolderActions/DocumentAllocator'
import ChangeOrderPusher from './FolderActions/ChangeOrderPusher'

export default {
  name: 'FolderActions',
  components: {
    Card,
    DocumentAllocator,
    ChangeOrderPusher
  },
  props: {
    containerId: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      required: true,
    },
    folderName: {
      type: String,
      required: true,
    },
    authString: {
      type: String,
      required: true
    }
  },
  data: () => ({
  }),
  methods: {
  }
}
</script>

<style scoped>

</style>
