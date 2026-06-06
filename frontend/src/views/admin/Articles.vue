<template>
  <div>
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
    <p v-else class="empty-hint">还没有文章，<router-link to="/admin/articles/new">写一篇</router-link></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api/client.js'

const articles = ref([])

async function load() {
  articles.value = await api.adminGetArticles()
}

async function remove(id) {
  if (!confirm('确定删除这篇文章？')) return
  await api.adminDeleteArticle(id)
  await load()
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('zh-CN')
}

onMounted(load)
</script>
