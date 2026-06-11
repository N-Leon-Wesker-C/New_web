<template>
  <form class="admin-form" @submit.prevent="save">
    <p v-if="error" class="form-msg error">{{ error }}</p>
    <label>版块</label>
    <select v-model="form.categoryId" required>
      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }} ({{ c.slug }})</option>
    </select>

    <label>标题</label>
    <input v-model="form.title" required />

    <label>URL Slug（留空自动生成）</label>
    <input v-model="form.slug" placeholder="my-article-title" />

    <label>正文（Markdown）</label>
    <textarea 
      v-model="form.content" 
      class="article-content-textarea" 
      placeholder="# 标题&#10;&#10;正文内容..."
    ></textarea>

    <label class="checkbox-label">
      <input type="checkbox" v-model="form.published" />
      发布（取消勾选为草稿）
    </label>

    <div class="admin-actions" style="margin-top:16px">
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? '保存中...' : '保存' }}
      </button>
      <router-link to="/admin/articles" class="btn-secondary">取消</router-link>
    </div>
    <p v-if="message" class="form-msg" :class="{ error: isError }">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../api/client.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const categories = ref([])
const loading = ref(false)
const message = ref('')
const isError = ref(false)
const error = ref('')

const form = ref({
  categoryId: null,
  title: '',
  slug: '',
  content: '',
  published: true,
})

onMounted(async () => {
  try {
    categories.value = await api.getCategories()
    if (categories.value.length) {
      form.value.categoryId = categories.value[0].id
    }

    if (isEdit.value) {
      const articles = await api.adminGetArticles()
      const article = articles.find((a) => String(a.id) === route.params.id)
      if (article) {
        form.value = {
          categoryId: article.category_id,
          title: article.title,
          slug: article.slug,
          content: article.content,
          published: !!article.published,
        }
      }
    }
  } catch (e) {
    error.value = e.message || '加载失败'
  }
})

async function save() {
  loading.value = true
  message.value = ''
  isError.value = false
  try {
    const body = {
      categoryId: form.value.categoryId,
      title: form.value.title,
      slug: form.value.slug || undefined,
      content: form.value.content,
      published: form.value.published,
    }
    if (isEdit.value) {
      await api.adminUpdateArticle(route.params.id, body)
    } else {
      await api.adminCreateArticle(body)
    }
    router.push('/admin/articles')
  } catch (e) {
    isError.value = true
    message.value = e.message || '保存失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.article-content-textarea {
  min-height: 400px !important;
  resize: vertical !important;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>
