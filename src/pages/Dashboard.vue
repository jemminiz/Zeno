<template>
  <div class="min-h-screen bg-gray-800 text-red-300">
    <!-- Topbar -->
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <!-- Logo + Title -->
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" alt="Zeno Logo" class="h-8 w-8" />
        <h1 class="text-2xl font-bold text-red-300">Zeno Dashboard</h1>
      </div>

      <!-- User Dropdown -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          <span>Jonathan</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow z-50"
        >
          <a href="#" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          <button
            @click="handleLogout"
            class="w-full text-left block px-4 py-2 hover:bg-gray-700 text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <p class="text-red-300 mb-6">Here’s your overview:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="card in cards" :key="card.id"
          class="bg-gray-700 p-5 rounded-lg shadow transition-colors duration-200">
          <!-- View Mode -->
          <div v-if="!card.editing">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ card.title }}</h3>
              <button @click="startEditing(card)" class="text-gray-400 hover:text-white">
                ✏️
              </button>
              <button @click="deleteCard(card)" class="text-red-400 hover:text-red-600">
                🗑️
              </button>
            </div>
            <p class="text-gray-300 mb-4">{{ card.content }}</p>
          </div>

          <!-- Edit Mode -->
          <div v-else>
            <input v-model="card.draftTitle" class="w-full bg-gray-800 text-white p-2 rounded mb-2" />
            <textarea v-model="card.draftContent" rows="3"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '@/utils/auth'

// **1. Auth & dropdown state**
const { logout } = useAuth()
const dropdownOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleLogout() {
  logout()
}

// **2. Cards logic**
const cards = ref<Array<{
  id: number
  title: string
  content: string
  editing: boolean
  draftTitle: string
  draftContent: string
}>>([])

// Load saved cards from localStorage (if any)
const savedCards = JSON.parse(localStorage.getItem('cards') || '[]')
cards.value = savedCards

// Watch for changes in cards and persist them
watch(cards, (newCards) => {
  localStorage.setItem('cards', JSON.stringify(newCards))
}, { deep: true })

// Add a new card, defaulting into edit mode
function addCard() {
  const id = Date.now()
  cards.value.push({
    id,
    title: `Card ${cards.value.length + 1}`,
    content: 'Click ✏️ to edit me!',
    editing: true,
    draftTitle: `Card ${cards.value.length + 1}`,
    draftContent: 'Click ✏️ to edit me!',
  })
}

// Enter edit mode, copying current values into draft fields
function startEditing(card: any) {
  card.draftTitle = card.title
  card.draftContent = card.content
  card.editing = true
}

// Cancel edits
function cancelEditing(card: any) {
  card.editing = false
}

// Save edits
function saveEditing(card: any) {
  card.title = card.draftTitle
  card.content = card.draftContent
  card.editing = false
}

// Delete a card
function deleteCard(card: any) {
  const index = cards.value.findIndex((c) => c.id === card.id)
  if (index !== -1) {
    cards.value.splice(index, 1)
  }
}
</script>
