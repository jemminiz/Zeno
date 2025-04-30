<template>
  <div class="min-h-screen bg-gray-800 text-red-300">
    <!-- Topbar -->
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" alt="Zeno Logo" class="h-8 w-8" />
        <h1 class="text-2xl font-bold text-red-300">Zeno Dashboard</h1>
      </div>
      <div class="relative" @click="toggleDropdown">
        <button class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
          <span>Jonathan</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow z-50">
          <a href="#" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          <a href="#" @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700 text-red-400">Logout</a>
        </div>
      </div>
    </header>

    <main class="p-6">
      <div v-if="cards.length === 0" class="text-center text-gray-400 py-20">
        <p>No cards yet. Click the + button to get started!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="p-5 rounded-lg transition-colors duration-200"
          :style="getCardStyle(card)"
        >
          <!-- View Mode -->
          <div v-if="!card.editing">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ card.title }}</h3>
              <div class="flex space-x-2">
                <button @click="startEditing(card)" class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 text-white border border-gray-600">✏️</button>
                <button @click="confirmDelete(card)" class="bg-gray-700 px-2 py-1 rounded hover:bg-red-600 text-red-400 border border-red-400">🗑️</button>
              </div>
            </div>
            <p class="text-gray-300 mb-2">{{ card.content || 'Sample content...' }}</p>
            <p class="text-sm text-gray-400 italic">Category: {{ card.category || 'Uncategorized' }}</p>
          </div>

          <!-- Edit Mode -->
          <div v-else>
            <input v-model="card.draftTitle" placeholder="Title" class="w-full bg-gray-800 text-white p-2 rounded mb-2" />
            <textarea
              v-model="card.draftContent"
              rows="3"
              placeholder="Details..."
              class="w-full bg-gray-800 text-white p-2 rounded mb-2 resize-none"
            ></textarea>

            <!-- Category Dropdown -->
            <select v-model="card.draftCategory" class="w-full bg-gray-800 text-white p-2 rounded mb-2">
              <option v-for="cat in categoriesStore.allCategories" :key="cat.name" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>

            <!-- Personal Color -->
            <label class="block text-sm mb-1 text-gray-400">Personal Card Color:</label>
            <input type="color" v-model="card.draftColor" class="mb-4 w-12 h-8 bg-transparent border-none cursor-pointer" />

            <div class="flex justify-end space-x-2">
              <button @click="cancelEditing(card)" class="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
              <button @click="saveEditing(card)" class="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Button -->
    <div class="fixed bottom-6 right-6">
      <button
        @click="addCard"
        class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-lg transition"
      >
        <span class="text-2xl">+</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/auth'
import { useCategoriesStore } from '@/stores/categories'

const router = useRouter()
const { logout } = useAuth()
const categoriesStore = useCategoriesStore()

const dropdownOpen = ref(false)
const cards = ref([])

watch(cards, (newCards) => {
  localStorage.setItem('cards', JSON.stringify(newCards))
}, { deep: true })

const savedCards = JSON.parse(localStorage.getItem('cards') || '[]')
cards.value = savedCards

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleLogout() {
  logout()
  router.push('/')
}

function addCard() {
  const id = Date.now()
  cards.value.push({
    id,
    title: '',
    content: '',
    category: '',
    color: '',
    editing: true,
    draftTitle: '',
    draftContent: '',
    draftCategory: '',
    draftColor: '#ffffff'
  })
}

function startEditing(card: any) {
  card.draftTitle = card.title
  card.draftContent = card.content
  card.draftCategory = card.category
  card.draftColor = card.color || '#ffffff'
  card.editing = true
}

function cancelEditing(card: any) {
  if (!card.title && !card.content) {
    cards.value = cards.value.filter(c => c.id !== card.id)
  } else {
    card.editing = false
  }
}

function saveEditing(card: any) {
  card.title = card.draftTitle
  card.content = card.draftContent
  card.category = card.draftCategory
  card.color = card.draftColor
  card.editing = false
}

function confirmDelete(card: any) {
  if (confirm('Are you sure you want to delete this card?')) {
    cards.value = cards.value.filter(c => c.id !== card.id)
  }
}

function getCardStyle(card: any) {
  let color = ''
  if (card.color && card.color !== '#ffffff') {
    color = card.color
  } else {
    const category = categoriesStore.allCategories.find(cat => cat.name === card.category)
    color = category?.color || '#4B5563'
  }

  return {
    backgroundColor: `${color}40`,
    border: `1px solid ${color}`,
    boxShadow: `0 0 4px ${color}`,
  }
}
</script>
