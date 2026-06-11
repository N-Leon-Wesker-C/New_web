<template>
  <div class="markdown-body content">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: { type: String, default: '' },
})

// 确保marked同步执行
marked.setOptions({
  async: false
})

const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    return marked.parse(props.content)
  } catch (e) {
    console.error('Markdown解析错误:', e)
    // 失败时返回原始内容
    return `<pre style="white-space: pre-wrap;">${props.content}</pre>`
  }
})
</script>
