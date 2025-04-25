<template>
  <div class="min-h-screen bg-gray-800 text-red-300 relative">

    <!-- Topbar -->
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" class="h-8 w-8" alt="Zeno Logo" />
        <h1 class="text-2xl font-bold text-red-300">Zeno Dashboard</h1>
      </div>
      <div class="relative">
        <button @click="toggleDropdown"
          class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
          <span>Jonathan</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow z-50">
          <a href="#" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          <button @click="handleLogout"
            class="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="p-6">
      <!-- No cards placeholder -->
      <div v-if="cards.length === 0" class="text-center text-gray-400 italic py-12">
        No cards yet. Click <span class="font-bold">+</span> to add one.
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="card in cards" :key="card.id" class="bg-gray-700 p-5 rounded-lg shadow">

          <!-- VIEW MODE -->
          <div v-if="!card.editing">
            <div class="flex justify-between items-start mb-2">
              <!-- Title or placeholder -->
              <h3 class="text-lg font-semibold" :class="card.title ? 'text-white' : 'italic text-gray-500'">
                {{ card.title || '— Untitled card —' }}
              </h3>
              <div class="flex space-x-2 bg-gray-600 rounded-lg py-1 px-2 border border-gray-500">
                <button @click="startEditing(card)"
                  class="text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-500 rounded">
                  ✏️
                </button>
                <button @click="promptDelete(card)"
                  class="text-red-400 hover:text-red-600 px-2 py-1 hover:bg-gray-500 rounded">
                  🗑️
                </button>
              </div>
            </div>
            <!-- Content or placeholder -->
            <p :class="card.content ? 'text-gray-300' : 'italic text-gray-500'">
              {{ card.content || 'No content yet. Click ✏️ to add some.' }}
            </p>
          </div>

          <!-- EDIT MODE -->
          <div v-else>
            <input v-model="card.draftTitle" :placeholder="card.isNew
              ? 'Enter card title…'
              : (card.draftTitle || 'Sample title')" class="w-full bg-gray-800 text-white p-2 rounded mb-2" />
            <textarea v-model="card.draftContent" :placeholder="card.isNew
              ? 'Enter card content…'
              : (card.draftContent || 'Sample content')" rows="3"
              class="w-full bg-gray-800 text-white p-2 rounded mb-4 resize-none"></textarea>
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

    <!-- Delete Confirmation Modal -->
    <div v-if="confirmDialog.visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <p class="text-white mb-4">Are you sure you want to delete <strong>{{ confirmDialog.card.title || 'Untitled Card' }}</strong>?</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete"
            class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white">Cancel</button>
          <button @click="confirmDelete"
            class="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '@/utils/auth'

// Auth & Dropdown
const { logout } = useAuth()
const dropdownOpen = ref(false)
function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function handleLogout() { logout() }

// Cards State
interface Card {
  id: number
  title: string
  content: string
  editing: boolean
  draftTitle: string
  draftContent: string
  isNew?: boolean
}
const cards = ref<Card[]>([])
cards.value = JSON.parse(localStorage.getItem('cards') || '[]')

// Persist Cards
watch(cards, (c) => {
  localStorage.setItem('cards', JSON.stringify(c))
}, { deep: true })

// Add Card (starts in edit mode, marked new)
function addCard() {
  const id = Date.now()
  cards.value.push({
    id,
    title: '',
    content: '',
    editing: true,
    draftTitle: '',
    draftContent: '',
    isNew: true,
  })
}

// Edit Flow
function startEditing(card: Card) {
  card.draftTitle = card.title
  card.draftContent = card.content
  card.editing = true
}

function cancelEditing(card: Card) {
  if (card.isNew) {
    // Remove brand new card
    cards.value = cards.value.filter((c) => c.id !== card.id)
  } else {
    card.editing = false
  }
}

function saveEditing(card: Card) {
  card.title = card.draftTitle
  card.content = card.draftContent
  card.editing = false
  card.isNew = false
}

// Delete Confirmation
const confirmDialog = ref<{ visible: boolean; card: Card | null }>({
  visible: false,
  card: null,
})

function promptDelete(card: Card) {
  confirmDialog.value = { visible: true, card }
}

function cancelDelete() {
  confirmDialog.value.visible = false
  confirmDialog.value.card = null
}

function confirmDelete() {
  const card = confirmDialog.value.card!
  cards.value = cards.value.filter((c) => c.id !== card.id)
  cancelDelete()
}
</script>
