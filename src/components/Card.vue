<!-- src/components/Card.vue -->
<template>
    <div
      class="bg-gray-700 hover:bg-gray-600 text-white p-5 rounded-lg shadow 
             transition-colors duration-200 ease-in-out"
    >
      <h3 class="text-lg font-semibold mb-3">{{ title }}</h3>
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ title: string }>()
  </script>
  