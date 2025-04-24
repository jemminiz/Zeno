<template>
    <div
      :class="darkMode ? 'bg-black' : 'bg-white'"
      class="relative flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300"
    >
      <!-- Dark Mode Toggle -->
      <div class="fixed top-4 right-4 cursor-pointer z-20" @click="toggleDarkMode">
        <!-- icons omitted for brevity -->
      </div>
  
      <!-- Logo -->
      <img src="@/assets/logo.png" alt="Zeno Logo" class="w-28 mb-5" style="width: 400px; height: auto;" />
  
      <!-- Login Card -->
      <div class="w-[400px] bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl shadow-md p-6 text-white">
        <h1 class="text-xl font-semibold text-center mb-4">Welcome to Zeno</h1>
  
        <!-- 👇 Note the @submit.prevent -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full bg-white/10 placeholder-gray-400 text-white p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full bg-white/10 placeholder-gray-400 text-white p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <button
            type="submit"
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
          >
            Log In
          </button>
        </form>
  
        <div class="flex justify-between text-xs mt-4">
          <a href="#" class="text-red-400 hover:underline">Create Account</a>
          <a href="#" class="text-red-400 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuth } from '@/utils/auth'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  // login function
  const { login } = useAuth()

  // dark mode toggle state
  const darkMode = ref(true)
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }
  
  // form fields
  const username = ref('')
  const password = ref('')
  
  // router instance
  const router = useRouter()
  
  // login + redirect
  function handleLogin() {
  if (!username.value || !password.value) {
    alert('Please enter username and password.')
    return
  }

  const success = login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  } else {
    alert('Invalid credentials.')
  }
}
</script>
  