<template>
  <div v-if="props.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ props.title }}</h2>
      <p class="mb-4 text-gray-300">{{ props.message }}</p>
      <div v-if="props.showInput" class="mb-6">
        <input
          v-model="inputValue"
          type="text"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter new value"
        />
      </div>
      <div class="flex justify-end space-x-3">
        <button @click="handleCancel" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Cancel</button>
        <button @click="handleConfirm" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  visible: boolean
  title: string
  message: string
  showInput?: boolean
  onConfirm: (inputValue?: string) => void
  onCancel: () => void
}>()

const inputValue = ref('')

function handleConfirm() {
  props.onConfirm(inputValue.value);
}

function handleCancel() {
  inputValue.value = ''; // Reset input value only on cancel
  props.onCancel();
}
</script>
