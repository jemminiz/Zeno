<template>
  <div class="min-h-screen bg-gray-800 text-red-300 p-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Manage Categories</h1>

    <div class="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 shadow-lg">
      <div v-for="(color, category) in localCategoryColors" :key="category" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold">{{ category }}</h2>
          <input
            type="color"
            v-model="localCategoryColors[category]"
            class="w-12 h-8 rounded border-0 p-0 bg-transparent"
          />
        </div>
        <div class="h-2 rounded" :style="{ backgroundColor: localCategoryColors[category] }"></div>
      </div>

      <div class="flex justify-center mt-8 space-x-4">
        <button
          @click="saveChanges"
          class="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Save
        </button>
        <button
          @click="resetDefaults"
          class="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Default categories
const defaultCategoryColors = {
  Work: '#3490dc',
  Personal: '#f472b6',
  Finance: '#34d399',
  Health: '#f87171',
  Learning: '#fbbf24',
}

// Load existing colors from localStorage
const storedColors = JSON.parse(localStorage.getItem('categoryColors') || '{}')
const localCategoryColors = ref<Record<string, string>>({
  ...defaultCategoryColors,
  ...storedColors,
})

const router = useRouter()

function saveChanges() {
  localStorage.setItem('categoryColors', JSON.stringify(localCategoryColors.value))
  alert('Saved successfully!')
  router.push('/dashboard')
}

function resetDefaults() {
  localCategoryColors.value = { ...defaultCategoryColors }
}
</script>
