<template>
  <div class="page-main">
    <section class="hero hero-sm">
      <div class="hero-bg"></div>
      <div class="hero-content fade-in">
        <p v-if="category" class="hero-eyebrow">{{ category.slug }}</p>
        <h1 class="hero-title">{{ category?.name || '加载中...' }}</h1>
        <p v-if="category?.description" class="hero-copy">{{ category.description }}</p>
      </div>
    </section>

    <div class="article-list fade-in">
      <router-link
        v-for="a in articles"
        :key="a.id"
        :to="`/${group}/${section}/${a.slug}`"
        class="article-item"
      >
        <h3>{{ a.title }}</h3>
        <p class="date">{{ formatDate(a.created_at) }}</p>
      </router-link>
      <p v-if="!loading && articles.length === 0" class="empty-hint">
        暂无文章，管理员可在 <router-link to="/admin">后台</router-link> 发布
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api/client.js'
import { useFadeIn } from '../composables/useFadeIn.js'

const props = defineProps({
  group: { type: String, required: true },
  section: { type: String, required: true },
})

useFadeIn()

const categorySlug = computed(() => `${props.group}/${props.section}`)
const category = ref(null)
const articles = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    category.value = await api.getCategory(categorySlug.value)
    articles.value = await api.getArticles(categorySlug.value)
  } catch {
    category.value = { name: '版块不存在', description: '' }
    articles.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-CN')
}

onMounted(load)
watch(() => [props.group, props.section], load)
</script>
