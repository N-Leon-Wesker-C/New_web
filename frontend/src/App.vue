<template>
  <NavBar v-if="!isAdmin" />
  <router-view />
  <SiteFooter v-if="!isAdmin && !hideFooter" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const hideFooter = computed(() => route.name === 'home')
</script>
