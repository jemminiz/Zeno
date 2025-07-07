<template>
  <button @click="openLink">Link Account</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
let linkHandler: any = null;

declare global {
  interface Window {
    Plaid: any;
  }
}

async function openLink() {
  const res = await fetch('/api/create_link_token');
  const { link_token } = await res.json();

  linkHandler = window.Plaid.create({
    token: link_token,
    onSuccess: async (public_token) => {
      await fetch('/api/exchange_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      alert('Account linked!');
    },
    onExit: () => {
      console.log('User exited Plaid Link');
    },
  });

  linkHandler.open();
}
</script>
