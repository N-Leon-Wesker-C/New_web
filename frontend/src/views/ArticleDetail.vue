<template>
  <div class="page-main">
    <section class="hero hero-sm">
      <div class="hero-bg"></div>
      <div class="hero-content fade-in">
        <p class="hero-eyebrow">{{ article?.category_name }}</p>
        <h1 class="hero-title">{{ article?.title || '加载中...' }}</h1>
        <p v-if="article" class="date-tag">{{ formatDate(article.created_at) }}</p>
      </div>
    </section>

    <MarkdownBody v-if="article" class="fade-in" :content="article.content" />

    <section v-if="article" class="comments-section fade-in">
      <h2>评论 ({{ comments.length }})</h2>
      <CommentList :comments="comments" />
      <CommentForm :article-id="article.id" @submitted="loadComments" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api/client.js'
import { useFadeIn } from '../composables/useFadeIn.js'
import MarkdownBody from '../components/MarkdownBody.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

const props = defineProps({
  group: { type: String, required: true },
  section: { type: String, required: true },
  slug: { type: String, required: true },
})

useFadeIn()

const categorySlug = computed(() => `${props.group}/${props.section}`)
const article = ref(null)
const comments = ref([])

async function loadArticle() {
  try {
    article.value = await api.getArticle(categorySlug.value, props.slug)
    await loadComments()
  } catch {
    article.value = null
  }
}

async function loadComments() {
  if (!article.value) return
  comments.value = await api.getComments(article.value.id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-CN')
}

onMounted(loadArticle)
watch(() => [props.group, props.section, props.slug], loadArticle)
</script>
