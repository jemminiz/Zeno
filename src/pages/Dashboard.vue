<template>
  <div class="min-h-screen bg-gray-800 text-red-300">
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <h1 class="text-2xl font-bold text-red-300">Zeno Dashboard</h1>
    </header>

    <main class="p-6">
      <!-- Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="relative p-4 bg-gray-900 rounded shadow text-white"
        >
          <!-- Display the card name -->
          <h2 class="text-lg font-bold mb-2">{{ card.name }}</h2>

          <!-- Render Card -->
          <component
            v-if="getCardComponent(card.type)"
            :is="getCardComponent(card.type)"
            v-bind="card.props"
          />

          <!-- Edit and Delete Buttons -->
          <div class="absolute top-2 right-2 flex space-x-2">
            <button
              @click="editCard(index)"
              class="text-white px-2 py-1 rounded hover:bg-gray-500 bg-customBlue"
            >
              Edit
            </button>
            <button
              @click="confirmDeleteCard(index)"
              class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Add Card Button -->
      <div class="fixed bottom-4 right-4">
        <button
          @click="toggleDropdown"
          class="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-500"
        >
          Add Card
        </button>
        <div v-if="dropdownOpen">
          <!-- Fullscreen Overlay -->
          <div
            class="fixed inset-0 z-40"
            @click="closeDropdown"
          ></div>

          <!-- Dropdown Menu -->
          <div
            class="absolute bottom-12 right-0 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50"
          >
            <button
              v-for="type in cardTypes"
              :key="type.value"
              @click="addCard(type.value)"
              class="block w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Warning Modal -->
    <WarningModal
      v-if="warningModal.visible"
      :visible="warningModal.visible"
      :title="warningModal.title"
      :message="warningModal.message"
      :showInput="warningModal.showInput"
      :onConfirm="warningModal.onConfirm"
      :onCancel="warningModal.onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AccountBalanceCard from '@/components/cards/AccountBalanceCard.vue';
import SpendingSummaryCard from '@/components/cards/SpendingSummaryCard.vue';
import UpcomingBillsCard from '@/components/cards/UpcomingBillsCard.vue';
import BudgetMathCard from '@/components/cards/BudgetCard.vue';
import WarningModal from '@/components/WarningModal.vue';

const API_URL = import.meta.env.VITE_API_URL;

const cards = ref([]); // Cards array

// Fetch cards from the API when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/api/cards`);
    cards.value = response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
});

// Function to return the correct card component based on the type
function getCardComponent(type: string) {
  switch (type) {
    case 'account-balance':
      return AccountBalanceCard;
    case 'spending-summary':
      return SpendingSummaryCard;
    case 'upcoming-bills':
      return UpcomingBillsCard;
    case 'budget-math':
      return BudgetMathCard;
    default:
      return null;
  }
}

// Add a new card
async function addCard(type: string) {
  dropdownOpen.value = false; // Close dropdown after selection
  const newCard = { type, name: `New ${type.replace('-', ' ')}`, props: {} };
  try {
    const response = await axios.post(`${API_URL}/api/cards`, newCard);
    cards.value.push(response.data);
  } catch (error) {
    console.error('Error adding card:', error);
  }
}

// Edit a card
async function editCard(index: number) {
  const card = cards.value[index];

  warningModal.value = {
    visible: true,
    title: 'Edit Card',
    message: 'Enter a new name for the card:',
    showInput: true,
    onConfirm: async (inputValue?: string) => {
      if (inputValue) {
        card.name = inputValue;
      }
      warningModal.value.visible = false;

      try {
        const response = await axios.put(`http://localhost:3000/api/cards/${index}`, card);
        cards.value[index] = response.data;
      } catch (error) {
        console.error('Error updating card:', error);
      }
    },
    onCancel: () => {
      warningModal.value.visible = false;
    }
  };
}

// Delete a card
async function deleteCard(index: number) {
  try {
    await axios.delete(`http://localhost:3000/api/cards/${index}`);
    cards.value.splice(index, 1);
  } catch (error) {
    console.error('Error deleting card:', error);
  }
}

// Confirm delete card
function confirmDeleteCard(index: number) {
  const cardName = cards.value[index]?.name || 'this card'; // Fallback to 'this card' if name is missing

  warningModal.value = {
    visible: true,
    title: 'Delete Card',
    message: `Are you sure you want to delete "${cardName}"?`, // Include the card name in the message
    showInput: false, // No input needed for deletion
    onConfirm: async () => {
      await deleteCard(index); // Call the existing deleteCard function
      warningModal.value.visible = false; // Hide the modal after deletion
    },
    onCancel: () => {
      warningModal.value.visible = false; // Simply hide the modal on cancellation
    }
  };
}

const warningModal = ref({
  visible: false,
  title: '',
  message: '',
  showInput: false,
  onConfirm: () => {},
  onCancel: () => {
    warningModal.value.visible = false;
  }
});

const dropdownOpen = ref(false);

const cardTypes = [
  { value: 'account-balance', label: 'Account Balance' },
  { value: 'spending-summary', label: 'Spending Summary' },
  { value: 'upcoming-bills', label: 'Upcoming Bills' },
  { value: 'budget-math', label: 'Budget Math' }
];

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}
</script>
