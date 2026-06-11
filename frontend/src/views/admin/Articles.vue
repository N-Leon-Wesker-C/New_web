<template>
  <div>
    <p v-if="error" class="form-msg error">{{ error }}</p>
    <table class="admin-table" v-if="articles.length">
      <thead>
        <tr>
          <th>标题</th>
          <th>版块</th>
          <th>状态</th>
          <th>更新</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in articles" :key="a.id">
          <td>{{ a.title }}</td>
          <td>{{ a.category_name }}</td>
          <td>{{ a.published ? '已发布' : '草稿' }}</td>
          <td>{{ formatDate(a.updated_at) }}</td>
          <td class="admin-actions">
            <router-link :to="`/admin/articles/${a.id}/edit`" class="btn-secondary btn-small">编辑</router-link>
            <button class="btn-secondary btn-small btn-danger" @click="remove(a.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!loading" class="empty-hint">还没有文章，<router-link to="/admin/articles/new">写一篇</router-link></p>
    <p v-else>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api/client.js'

const articles = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    articles.value = await api.adminGetArticles()
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (!confirm('确定删除这篇文章？')) return
  try {
    await api.adminDeleteArticle(id)
    await load()
  } catch (e) {
    error.value = e.message || '删除失败'
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('zh-CN')
}

onMounted(load)
</script>
