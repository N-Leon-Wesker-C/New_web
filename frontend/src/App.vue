<template>
  <NavBar v-if="!isAdmin" />
  <router-view />
  <SiteFooter v-if="!isAdmin && !hideFooter" />
  <div class="music-player-fixed" :class="{ hidden: isAdmin }">
    <div class="disc" :class="{ rotate: true, pause: audioPaused }">
      <img src="/music.png" alt="cover" />
    </div>
    <audio ref="audioEl" controls loop @play="audioPaused = false" @pause="audioPaused = true">
      <source src="/ColorYourNight.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import { getUserToken, getUser, api } from './api/client.js'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const hideFooter = computed(() => route.name === 'home')
const audioPaused = ref(false)
const audioEl = ref(null)

// 应用启动时验证登录状态
onMounted(async () => {
  const token = getUserToken()
  if (token) {
    try {
      // 验证token是否有效
      await api.userProfile()
    } catch (e) {
      // token无效，清除
    }
  }
})
</script>

<style>
.music-player-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  text-align: center;
  background: rgba(0, 8, 16, 0.9);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 255, 0.2);
  transition: opacity 0.3s, visibility 0.3s;
}

.music-player-fixed.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.music-player-fixed .disc {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #333;
  margin: 0 auto 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.music-player-fixed .disc::after {
  content: "";
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.music-player-fixed .disc img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.music-player-fixed .disc.rotate {
  animation: rotate 10s linear infinite;
}

.music-player-fixed .disc.pause {
  animation-play-state: paused;
}

.music-player-fixed audio {
  width: 200px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
