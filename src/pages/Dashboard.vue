<template>
  <div class="min-h-screen bg-gray-800 text-red-300 relative">
    <!-- Topbar… -->

    <main class="p-6">
      <p class="text-red-300 mb-6">Here’s your overview:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="bg-gray-700 p-5 rounded-lg shadow transition-colors duration-200"
        >
          <!-- VIEW MODE -->
          <div v-if="!card.editing">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ card.title }}</h3>
              <button @click="startEditing(card)" class="text-gray-400 hover:text-white">
                ✏️
              </button>
            </div>
            <p class="text-gray-300 mb-4">{{ card.content }}</p>
          </div>

          <!-- EDIT MODE -->
          <div v-else>
            <input
              v-model="card.draftTitle"
              class="w-full bg-gray-800 text-white p-2 rounded mb-2"
            />
            <textarea
              v-model="card.draftContent"
              rows="3"
              class="w-full bg-gray-800 text-white p-2 rounded mb-4 resize-none"
            ></textarea>
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
        class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg 
               flex items-center justify-center shadow-lg transition"
      >
        <span class="text-2xl">+</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/utils/auth'

const { logout } = useAuth()
const dropdownOpen = ref(false)

// Your reactive cards array
const cards = ref<Array<{
  id: number
  title: string
  content: string
  editing: boolean
  draftTitle: string
  draftContent: string
}>>([])

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

// Persist edits back to the card
function saveEditing(card: any) {
  card.title = card.draftTitle
  card.content = card.draftContent
  card.editing = false
}

// Dropdown & logout (as before)
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
function handleLogout() {
  logout()
}
</script>
