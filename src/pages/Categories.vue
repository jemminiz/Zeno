<template>
  <div class="min-h-screen bg-gray-800 text-red-300 p-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Manage Categories</h1>

    <div class="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 shadow-lg">
      <div v-for="(color, category) in localCategoryColors" :key="category" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <input v-model="editableCategoryNames[category]" class="bg-gray-700 text-white rounded px-2 py-1" />
          <input type="color" v-model="localCategoryColors[category]"
            class="w-12 h-8 rounded border-0 p-0 bg-transparent" />
        </div>
        <div class="h-2 rounded" :style="{ backgroundColor: localCategoryColors[category] }"></div>
      </div>

      <div class="flex justify-center mt-8 space-x-4">
        <button @click="saveChanges" class="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition">
          <RouterLink to="dashboard">Save</RouterLink>
        </button>
        <button @click="confirmResetDefaults" class="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500 transition">Reset
          to Defaults</button>
      </div>
    </div>

    <!-- Modal -->
    <CustomModal v-if="showModal" :visible="showModal" title="Warning" :message="modalMessage" :confirm="modalConfirm"
      @confirm="modalResolve(true)" @cancel="modalResolve(false)" />


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CustomModal from '@/components/WarningModal.vue'
import { useCategoriesStore } from '@/stores/categories'

const router = useRouter()
const categoriesStore = useCategoriesStore()

const defaultCategoryColors = {
  Work: '#3490dc',
  Personal: '#f472b6',
  Finance: '#34d399',
  Health: '#f87171',
  Learning: '#fbbf24',
}

const localCategoryColors = ref<Record<string, string>>({})
const editableCategoryNames = ref<Record<string, string>>({})

// Modal state for reset confirmation only
const showModal = ref(false)
const modalMessage = ref('Are you sure you want to reset all categories to default?')
const modalConfirm = ref(true)
let modalResolve: (value: boolean) => void = () => { }

function showResetModal() {
  showModal.value = true
  return new Promise<boolean>((resolve) => {
    modalResolve = (result: boolean) => {
      showModal.value = false
      resolve(result)
    }
  })
}

function confirmResetDefaults() {
  showResetModal().then((confirmed) => {
    if (confirmed) {
      resetDefaults()
    }
  })
}

async function saveChanges() {
  const trimmedNames = Object.values(editableCategoryNames.value).map(name => name.trim());

  // Check for empty names
  if (trimmedNames.some(name => name === '')) {
    await showWarning('Category names cannot be empty.');
    return;
  }

  // Check for duplicate category names
  const lowerCaseSet = new Set(trimmedNames.map(n => n.toLowerCase()));
  if (lowerCaseSet.size < trimmedNames.length) {
    await showWarning('Category names must be unique.');
    return;
  }

  const newCategories = [];
  const newColorMap: Record<string, string> = {};

  // Construct the new categories and color map
  Object.keys(editableCategoryNames.value).forEach((oldName, index) => {
    const newName = trimmedNames[index];
    const color = localCategoryColors.value[oldName] || '#ffffff';
    newCategories.push({ name: newName, color });
    newColorMap[newName] = color;
  });

  // Update the store with new categories
  categoriesStore.updateCategoryNames(newCategories);
  
  // Save to localStorage
  localStorage.setItem('categories', JSON.stringify(newCategories));

  // Update local state
  localCategoryColors.value = newColorMap;
  editableCategoryNames.value = Object.fromEntries(trimmedNames.map((n, i) => [Object.keys(editableCategoryNames.value)[i], n]));

  // Navigate to the dashboard
  router.push('/dashboard');
}



function resetDefaults() {
  localCategoryColors.value = { ...defaultCategoryColors }
  editableCategoryNames.value = Object.fromEntries(Object.keys(defaultCategoryColors).map(key => [key, key]))
}

function showWarning(message: string) {
  modalMessage.value = message
  modalConfirm.value = false
  showModal.value = true
  return new Promise<void>((resolve) => {
    modalResolve = () => {
      showModal.value = false
      resolve()
    }
  })
}


onMounted(() => {
  categoriesStore.loadCategories()
  if (categoriesStore.allCategories.length === 0) {
    resetDefaults()
  } else {
    localCategoryColors.value = Object.fromEntries(categoriesStore.allCategories.map(cat => [cat.name, cat.color]))
    editableCategoryNames.value = Object.fromEntries(categoriesStore.allCategories.map(cat => [cat.name, cat.name]))
  }
})
</script>
