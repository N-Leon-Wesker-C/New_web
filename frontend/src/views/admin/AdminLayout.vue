<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>管理后台</h1>
      <div>
        <router-link to="/" class="btn-secondary btn-small">返回网站</router-link>
        <button class="btn-secondary btn-small" style="margin-left:8px" @click="logout">退出</button>
      </div>
    </div>
    <nav class="admin-nav">
      <router-link to="/admin/articles">文章管理</router-link>
      <router-link to="/admin/comments">评论管理</router-link>
      <router-link to="/admin/articles/new">+ 新建文章</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { clearAdminToken } from '../../api/client.js'

const router = useRouter()

function logout() {
  clearAdminToken()
  router.push('/admin/login')
}
</script>
