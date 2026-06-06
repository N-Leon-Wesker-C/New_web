<template>
  <div>
    <div v-if="comments.length === 0" class="empty-hint">暂无评论，来抢沙发吧</div>
    <div v-for="c in comments" :key="c.id" class="comment-card">
      <div class="comment-meta">
        <strong>{{ c.author_name }}</strong>
        · {{ formatDate(c.created_at) }}
      </div>
      <p>{{ c.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: { type: Array, default: () => [] },
})

function formatDate(iso) {
  return new Date(iso).toLocaleString('zh-CN')
}
</script>
