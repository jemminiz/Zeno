<!-- filepath: /c:/Users/jonat/Documents/Programming/Zeno/src/components/cards/BudgetMathCard.vue -->
<template>
  <div class="p-4 bg-gray-900 rounded shadow text-white">
    <h2 class="text-lg font-bold mb-4">Budget Math</h2>
    <div class="space-y-4">
      <!-- Formula Input -->
      <div>
        <label for="formula" class="block text-sm font-medium text-gray-300">Enter Formula:</label>
        <input
          v-model="formula"
          id="formula"
          type="text"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 1000 - 200 + 50"
        />
      </div>

      <!-- Result Display -->
      <div>
        <label class="block text-sm font-medium text-gray-300">Result:</label>
        <div class="px-4 py-2 bg-gray-800 text-white rounded">
          {{ result }}
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
    >
      Calculate
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { evaluate } from 'mathjs';

const formula = ref('');
const result = ref('');
const error = ref('');

function calculate() {
  try {
    error.value = ''; // Clear previous errors
    result.value = evaluate(formula.value); // Safely evaluate the formula
  } catch (err) {
    error.value = 'Invalid formula. Please check your input.';
  }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
