<template>
  <div class="login-page">
    <div class="login-box">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="email" type="email" required placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" required placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" required placeholder="至少6位密码" minlength="6" />
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input v-model="confirmPassword" type="password" required placeholder="再次输入密码" minlength="6" />
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
        <p v-if="error" class="form-msg error">{{ error }}</p>
        <p v-if="success" class="form-msg">{{ success }}</p>
      </form>
      <p class="switch-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, setUserToken, setUser } from '../api/client.js'

const router = useRouter()
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleRegister() {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (password.value.length < 6) {
    error.value = '密码至少需要6位'
    return
  }

  loading.value = true
  try {
    const result = await api.userRegister(email.value, username.value, password.value)
    setUserToken(result.token)
    setUser(result.user)
    success.value = '注册成功！即将跳转到首页...'
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border: 1px solid rgba(0, 100, 160, 0.2);
  background: rgba(0, 20, 40, 0.6);
}

.login-box h1 {
  font-family: 'Cinzel', serif;
  text-align: center;
  margin-bottom: 32px;
  color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 10, 20, 0.8);
  border: 1px solid rgba(0, 100, 160, 0.3);
  color: var(--text-main);
  font-family: 'Rajdhani', sans-serif;
  font-size: 15px;
}

.btn-primary {
  width: 100%;
  padding: 14px 36px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid var(--accent);
  background: rgba(0, 229, 255, 0.08);
  color: var(--accent);
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}

.btn-primary:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.18);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-msg {
  margin-top: 16px;
  font-size: 14px;
  color: var(--accent);
  text-align: center;
}

.form-msg.error {
  color: #ff6b6b;
}

.switch-link {
  margin-top: 24px;
  text-align: center;
  color: var(--text-muted);
}

.switch-link a {
  color: var(--accent);
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
