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
      <div class="relative" @click="toggleDropdown">
        <button class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
          <span>Jonathan</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow z-50"
        >
          <a href="#" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          <a href="#" @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700 text-red-400">Logout</a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <p class="text-red-300 mb-4">Here’s your overview:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-800 p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-2">Account Summary</h2>
          <p>Placeholder for account data...</p>
        </div>
        <div class="bg-gray-800 p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-2">Budget Overview</h2>
          <p>Placeholder for budget chart...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/utils/auth'
import { ref } from 'vue'

const { logout } = useAuth()
const dropdownOpen = ref(false)

function handleLogout() {
  logout()
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
</script>
