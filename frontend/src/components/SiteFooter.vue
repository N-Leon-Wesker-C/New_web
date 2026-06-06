<template>
  <footer>
    <div class="footer-logo">{{ logo }}</div>
    <div class="footer-copy">{{ copy }}</div>
  </footer>
</template>

<script setup>
defineProps({
  logo: { type: String, default: 'Personal Academic' },
  copy: { type: String, default: '© 2025 All rights reserved.' },
})
</script>
