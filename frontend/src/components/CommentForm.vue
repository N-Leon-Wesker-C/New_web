<template>
  <form class="comment-form" @submit.prevent="submit">
    <label>昵称</label>
    <input v-model="authorName" maxlength="50" required placeholder="你的名字" />

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
import { ref } from 'vue'
import { api } from '../api/client.js'

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

async function submit() {
  loading.value = true
  message.value = ''
  isError.value = false
  try {
    const res = await api.postComment(props.articleId, {
      authorName: authorName.value,
      content: content.value,
      website: website.value,
    })
    message.value = res.message
    content.value = ''
    emit('submitted')
  } catch (e) {
    isError.value = true
    message.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
