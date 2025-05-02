<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        <p class="mb-6 text-gray-300">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="onCancel" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Cancel</button>
          <button @click="onConfirm" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">Confirm</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    visible: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
  }>()
  </script>
  