<script setup>
<template>
import { useAuth } from '@/utils/auth';
import { watch } from 'vue';

const { isAuthenticated } = useAuth();

watch(isAuthenticated, (newVal) => {
  console.log('Authentication state changed:', newVal);
});
</script>

  <nav class="bg-gray-800 text-white p-4">
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">Zeno</h1>
      <div>
        <span v-if="isAuthenticated">Welcome, User!</span>
        <button v-else @click="goToLogin" class="ml-4 bg-red-600 px-4 py-2 rounded">Login</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '@/utils/auth';
import { useRouter } from 'vue-router';

const { isAuthenticated } = useAuth();
const router = useRouter();

function goToLogin() {
  router.push('/login');
}
</script>