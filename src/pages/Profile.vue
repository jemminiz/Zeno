<template>
  <div class="min-h-screen bg-gray-800 text-white p-6">
    <button
      @click="goToSplashScreen"
      class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
    >
      Return to Dashboard
    </button>
    <h1 class="text-2xl font-bold mb-4">Profile Settings</h1>
    <p>Here you can edit your profile settings. (To be implemented)</p>
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToSplashScreen() {
  router.push('/');
}
</script>

<style scoped>
/* Add any specific styles for the Profile page here */
</style>