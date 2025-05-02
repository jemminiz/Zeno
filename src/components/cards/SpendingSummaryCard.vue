<!-- filepath: /c:/Users/jonat/Documents/Programming/Zeno/src/components/cards/SpendingSummaryCard.vue -->
<template>
    <div class="p-4 bg-gray-900 rounded shadow text-white">
      <h3 class="text-lg font-semibold mb-4">Spending Summary</h3>
      <p class="text-2xl font-bold mb-2">{{ formattedTotalSpending }}</p>
      <ul class="text-sm text-gray-400">
        <li v-for="(amount, category) in spendingByCategory" :key="category">
          {{ category }}: {{ formatCurrency(amount) }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps({
    totalSpending: Number,
    spendingByCategory: Object
  })
  
  const formattedTotalSpending = computed(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(props.totalSpending)
  })
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
  </script>
  