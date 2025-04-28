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
          <span>{{ username }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <div v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow z-50">
          <a href="#" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          <a href="#" @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700 text-red-400">Logout</a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <div v-if="cards.length === 0" class="text-center text-gray-400">
        No cards yet. Click the ➕ button to add one!
      </div>

      <div class="flex justify-center mb-6">
        <button @click="goToCategories"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300">
          Manage Categories
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="card in cards" :key="card.id" :style="getCardStyle(card)"
          class="p-5 rounded-lg shadow border-2 transform transition hover:scale-105 hover:shadow-lg">


          <!-- View Mode -->
          <div v-if="!card.editing">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ card.title }}</h3>
              <div class="flex space-x-2">
                <button @click="startEditing(card)" class="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white">
                  ✏️
                </button>
                <button @click="confirmDelete(card)" class="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white">
                  🗑️
                </button>
              </div>
            </div>
            <p class="text-gray-300 mb-4">{{ card.content || "Sample text..." }}</p>
            <p v-if="card.category" class="text-sm text-gray-300 mt-2">Category: {{ card.category }}</p>
          </div>

          <!-- Edit Mode -->
          <div v-else>
            <input v-model="card.draftTitle" placeholder="Enter a title..."
              class="w-full bg-gray-800 text-white p-2 rounded mb-2" />
            <textarea v-model="card.draftContent" rows="3" placeholder="Enter some content..."
              class="w-full bg-gray-800 text-white p-2 rounded mb-2 resize-none"></textarea>

            <div class="mb-2">
              <select v-model="card.draftCategory" class="w-full bg-gray-800 text-white p-2 rounded">
                <option disabled value="">Select Category</option>
                <option v-for="cat in categoriesStore.categories" :key="cat.name" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <input v-model="card.draftPersonalColor" type="color"
              class="w-full h-10 p-1 rounded bg-gray-800 border border-gray-700 mb-2" />

            <div class="flex justify-end space-x-2">
              <button @click="cancelEditing(card)"
                class="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
              <button @click="saveEditing(card)" class="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Button -->
    <div class="fixed bottom-6 right-6">
      <button @click="addCard"
        class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-lg transition">
        <span class="text-2xl">+</span>
      </button>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="confirmDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-gray-800 p-6 rounded shadow-lg text-center w-80">
        <p class="mb-4 text-white">Are you sure you want to delete this card?</p>
        <div class="flex justify-around">
          <button @click="cancelDelete" class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
          <button @click="deleteCard" class="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/auth'
import { useCategoriesStore } from '@/stores/categories'

// Auth
const { logout } = useAuth()
const router = useRouter()
const username = "Jonathan"

// Cards
const cards = ref<Array<any>>([])

// Modal state
const confirmDeleteModal = ref(false)
const cardToDelete = ref<any>(null)

// Categories store
const categoriesStore = useCategoriesStore()

// Load cards
const savedCards = JSON.parse(localStorage.getItem('cards') || '[]')
cards.value = savedCards

// Save cards whenever they change
watch(cards, (newCards) => {
  localStorage.setItem('cards', JSON.stringify(newCards))
}, { deep: true })

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
function handleLogout() {
  logout()
  router.push('/login')
}

// Add a new card
function addCard() {
  const id = Date.now()
  cards.value.push({
    id,
    title: '',
    content: '',
    category: '',
    personalColor: '',
    editing: true,
    draftTitle: '',
    draftContent: '',
    draftCategory: '',
    draftPersonalColor: ''
  })
}

// Editing functions
function startEditing(card: any) {
  card.draftTitle = card.title
  card.draftContent = card.content
  card.draftCategory = card.category
  card.draftPersonalColor = card.personalColor
  card.editing = true
}
function cancelEditing(card: any) {
  if (!card.title && !card.content) {
    const index = cards.value.findIndex(c => c.id === card.id)
    if (index !== -1) cards.value.splice(index, 1)
  } else {
    card.editing = false
  }
}
function saveEditing(card: any) {
  card.title = card.draftTitle
  card.content = card.draftContent
  card.category = card.draftCategory
  card.personalColor = card.draftPersonalColor
  card.editing = false
}

// Delete confirmation
function confirmDelete(card: any) {
  cardToDelete.value = card
  confirmDeleteModal.value = true
}
function cancelDelete() {
  cardToDelete.value = null
  confirmDeleteModal.value = false
}
function deleteCard() {
  const index = cards.value.findIndex(c => c.id === cardToDelete.value.id)
  if (index !== -1) cards.value.splice(index, 1)
  cancelDelete()
}

// Get card color info
function getCardColor(card: any) {
  if (card.personalColor) return card.personalColor

  const categoryName = card.editing ? card.draftCategory : card.category
  const categoryObj = categoriesStore.categories.find(c => c.name === categoryName)
  return categoryObj?.color || null
}

// Get card styles
function getCardStyle(card: any) {
  const color = getCardColor(card)
  if (!color) {
    return {
      backgroundColor: 'rgba(55, 65, 81, 1)', // fallback (gray-700)
      borderColor: '#374151', // gray-700
      boxShadow: 'none',
      transition: 'all 0.3s ease'
    }
  }

  const rgbaColor = hexToRgba(color, 0.25)
  return {
    backgroundColor: rgbaColor,
    borderColor: color,
    transition: 'all 0.3s ease',
    '--tw-shadow-color': color,
    boxShadow: `0 0 6px 1px ${color}` // ✅ smaller, softer glow
  }
}

// Helper function
function hexToRgba(hex: string, alpha: number) {
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }
  return `rgba(${r},${g},${b},${alpha})`
}

// Dropdown state
const dropdownOpen = ref(false)


function goToCategories() {
  router.push('/categories')
}

</script>

<style scoped>
/* Custom extra styling if needed */
</style>
