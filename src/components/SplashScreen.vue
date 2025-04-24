<template>
  <div class="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
    <img :src="logoUrl" alt="Zeno Logo" style="width: 400px; height: auto;" />
    <p class="text-xl mb-4">Loading Zeno...</p>
    <div class="w-[400px] h-[32px] bg-gray-700 mt-6 rounded overflow-hidden border border-white relative">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoUrl = new URL('@/assets/logo.png', import.meta.url).href
const progress = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) {
      clearInterval(interval)
      router.push('/login') // ✅ Navigate via router
    }
  }, 100)
})
</script>

<style scoped>
.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #dc2626, #ef4444);
  transition: width 0.3s ease-in-out;
  border-radius: 0.25rem;
}
</style>
