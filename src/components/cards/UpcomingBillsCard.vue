<!-- filepath: /c:/Users/jonat/Documents/Programming/Zeno/src/components/cards/UpcomingBillsCard.vue -->
<template>
  <div class="p-4 bg-gray-900 rounded shadow text-white">
    <h3 class="text-lg font-semibold mb-4">Upcoming Bills</h3>
    <ul class="text-sm text-gray-400">
      <li v-for="bill in bills" :key="bill.id" class="mb-2">
        <div class="flex justify-between">
          <span>{{ bill.name }}</span>
          <span>{{ formatCurrency(bill.amount) }}</span>
        </div>
        <p class="text-xs text-gray-500">Due: {{ bill.dueDate }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  bills: Array
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
</script>
