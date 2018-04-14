<template>
  <div class="components-container">
    <div class="editor-container">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :zIndex="20"></markdown-editor>
    </div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/markdown-editor'

const content = `
**this is test**

* vue
* element
* webpack

## Simplemde
`

export default {
  name: 'markdown-demo',
  components: { MarkdownEditor },
  data() {
    return {
      content: content,
    }
  },
  methods: {

  }
}
</script>


