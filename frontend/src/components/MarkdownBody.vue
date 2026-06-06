<template>
  <div class="markdown-body content" v-html="html"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: { type: String, default: '' },
})

const html = computed(() => marked.parse(props.content || ''))
</script>
