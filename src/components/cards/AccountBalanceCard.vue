<template>
  <div class="p-4 bg-gray-900 rounded shadow text-white">
    <h3 class="text-lg font-semibold mb-2">{{ accountName }}</h3>
    <p class="text-2xl font-bold">{{ formattedBalance }}</p>
    <p class="text-sm text-gray-400">Last updated: {{ lastUpdated }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  accountName: String,
  balance: Number,
  lastUpdated: String
})

const formattedBalance = computed(() => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(props.balance)
})
</script>
