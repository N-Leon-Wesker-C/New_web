<template>
  <nav>
    <router-link to="/" class="nav-logo">Persona 3 Reload</router-link>
    <div class="nav-links">
      <router-link to="/about">关于</router-link>
      <a href="/#direction">研究方向</a>
      <a href="/#career">事业</a>
      <a href="/#blog">博客</a>
      <router-link to="/admin" class="admin-link">管理后台</router-link>
      <template v-if="user">
        <span class="user-name">你好，{{ user.username }}</span>
        <button class="logout-link" @click="handleLogout">退出</button>
      </template>
      <template v-else>
        <router-link to="/login">登录</router-link>
        <router-link to="/register">注册</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { getUser, clearUser, clearUserToken } from '../api/client.js'

const user = computed(() => getUser())

function handleLogout() {
  clearUser()
  clearUserToken()
}
</script>

<style scoped>
.user-name {
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 600;
}

.logout-link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.logout-link:hover {
  color: var(--accent);
}

.admin-link {
  color: #ffaa00 !important;
}
</style>
