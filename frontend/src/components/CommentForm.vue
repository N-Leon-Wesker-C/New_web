<template>
  <form class="comment-form" @submit.prevent="submit">
    <div v-if="user" class="user-info">
      <span>你好，<strong>{{ user.username }}</strong></span>
      <button type="button" class="logout-btn" @click="handleLogout">退出</button>
    </div>

    <template v-else>
      <label>昵称</label>
      <input v-model="authorName" maxlength="50" required placeholder="你的名字" />
      <p class="login-hint">
        <router-link to="/login">登录</router-link> 后评论无需填写昵称
      </p>
    </template>

    <label>评论</label>
    <textarea v-model="content" maxlength="500" required placeholder="写下你的想法..."></textarea>

    <label class="hp-field">
      网站
      <input v-model="website" tabindex="-1" autocomplete="off" />
    </label>

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? '提交中...' : '提交评论' }}
    </button>
    <p v-if="message" class="form-msg" :class="{ error: isError }">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api, getUser, clearUser, clearUserToken } from '../api/client.js'

const props = defineProps({
  articleId: { type: Number, required: true },
})

const emit = defineEmits(['submitted'])

const authorName = ref('')
const content = ref('')
const website = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const user = computed(() => getUser())

function handleLogout() {
  clearUser()
  clearUserToken()
}

async function submit() {
  loading.value = true
  message.value = ''
  isError.value = false
  try {
    const body = user.value
      ? { content: content.value, website: website.value }
      : { authorName: authorName.value, content: content.value, website: website.value }

    const res = await api.postComment(props.articleId, body)
    message.value = res.message
    content.value = ''
    authorName.value = ''
    emit('submitted')
  } catch (e) {
    isError.value = true
    message.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px;
  background: rgba(0, 100, 160, 0.1);
  border: 1px solid rgba(0, 100, 160, 0.2);
}

.user-info strong {
  color: var(--accent);
}

.logout-btn {
  background: none;
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.login-hint {
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--text-muted);
}

.login-hint a {
  color: var(--accent);
  text-decoration: none;
}

.login-hint a:hover {
  text-decoration: underline;
}
</style>
