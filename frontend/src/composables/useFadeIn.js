import { onMounted, nextTick } from 'vue'

export function useFadeIn() {
  onMounted(() => {
    nextTick(() => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('visible')
          })
        },
        { threshold: 0.1 }
      )
      document.querySelectorAll('.fade-in').forEach((el) => obs.observe(el))
    })
  })
}
