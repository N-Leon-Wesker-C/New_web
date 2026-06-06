<template>
  <div>
    <table class="admin-table" v-if="comments.length">
      <thead>
        <tr>
          <th>昵称</th>
          <th>文章</th>
          <th>内容</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in comments" :key="c.id">
          <td>{{ c.author_name }}</td>
          <td>
            <router-link :to="articlePath(c)">{{ c.article_title }}</router-link>
          </td>
          <td style="max-width:300px">{{ c.content }}</td>
          <td>{{ c.approved ? '已通过' : '待审核' }}</td>
          <td class="admin-actions">
            <button
              v-if="!c.approved"
              class="btn-primary btn-small"
              @click="patch(c.id, { approved: true })"
            >通过</button>
            <button class="btn-secondary btn-small btn-danger" @click="patch(c.id, { delete: true })">
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty-hint">暂无评论</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api/client.js'

const comments = ref([])

function articlePath(c) {
  const [group, section] = c.category_slug.split('/')
  return `/${group}/${section}/${c.article_slug}`
}

async function load() {
  comments.value = await api.adminGetComments()
}

async function patch(id, body) {
  await api.adminPatchComment(id, body)
  await load()
}

onMounted(load)
</script>
