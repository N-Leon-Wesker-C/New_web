<template>
  <div class="page-main">
    <section class="hero hero-sm">
      <div class="hero-bg"></div>
      <div class="hero-content fade-in visible">
        <p class="hero-eyebrow">{{ article?.category_name }}</p>
        <h1 class="hero-title">{{ article?.title || '加载中...' }}</h1>
        <p v-if="article" class="date-tag">{{ formatDate(article.created_at) }}</p>
      </div>
    </section>

    <div v-if="error" class="content" style="color: red; padding: 40px;">
      <p>加载失败: {{ error }}</p>
    </div>
    
    <MarkdownBody v-if="article && !error" class="fade-in visible" :content="article.content" />

    <section v-if="article && !error" class="comments-section fade-in visible">
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
const error = ref('')

async function loadArticle() {
  error.value = ''
  try {
    console.log('正在加载文章:', categorySlug.value, props.slug)
    article.value = await api.getArticle(categorySlug.value, props.slug)
    console.log('文章数据加载成功:', article.value)
    console.log('文章内容:', article.value.content)
    await loadComments()
  } catch (e) {
    console.error('加载文章失败:', e)
    error.value = e.message || '加载失败'
  }
}

async function loadComments() {
  if (!article.value) return
  try {
    comments.value = await api.getComments(article.value.id)
  } catch (e) {
    console.error('加载评论失败:', e)
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-CN')
}

onMounted(loadArticle)
watch(() => `${props.group}/${props.section}/${props.slug}`, loadArticle)
</script>
