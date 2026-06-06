<template>
  <div class="login-box">
    <h1>管理后台</h1>
    <form class="admin-form" @submit.prevent="login">
      <label>用户名</label>
      <input v-model="username" required autocomplete="username" />
      <label>密码</label>
      <input v-model="password" type="password" required autocomplete="current-password" />
      <button type="submit" class="btn-primary" style="width:100%" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p v-if="error" class="form-msg error">{{ error }}</p>
    </form>
    <p style="text-align:center;margin-top:24px">
      <router-link to="/" style="color:var(--text-muted);font-size:13px">← 返回首页</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, setToken } from '../../api/client.js'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.login(username.value, password.value)
    setToken(res.token)
    router.push(route.query.redirect || '/admin/articles')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
