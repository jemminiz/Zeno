<template>
  <div class="min-h-screen bg-gray-800 text-red-300">
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <h1 class="text-2xl font-bold text-red-300">Zeno</h1>
      <!-- Profile Button -->
      <div class="relative" id="profile-dropdown">
        <button
          @click="profileDropdownOpen = !profileDropdownOpen"
          class="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          <img
            :src="profileImageUrl"
            alt="Profile"
            class="w-8 h-8 rounded-full object-cover border-2 border-gray-700"
          />
          <span class="text-white">Profile</span>
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          v-if="profileDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50"
        >
          <button
            @click="goToAccountSettings"
            class="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
          >
            Account Settings
          </button>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
          >
            Log Out
          </button>
        </div>
      </div>
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

      <!-- Account Input Form -->
      <div class="mb-8 max-w-md mx-auto bg-gray-900 p-4 rounded shadow">
        <h2 class="text-xl font-bold mb-4 text-white">Add Account</h2>
        <form @submit.prevent="addAccount" class="flex flex-col gap-3">
          <input
            v-model="accountName"
            type="text"
            placeholder="Account Name"
            class="px-3 py-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            v-model.number="accountBalance"
            type="number"
            step="0.01"
            placeholder="Balance"
            class="px-3 py-2 rounded bg-gray-800 text-white"
            required
          />
          <button
            type="submit"
            class="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Add Account
          </button>
        </form>
      </div>

      <!-- Accounts List -->
      <div class="mb-8 max-w-md mx-auto bg-gray-900 p-4 rounded shadow">
        <h2 class="text-xl font-bold mb-4 text-white">Accounts</h2>
        <draggable
          v-model="accounts"
          item-key="id"
          tag="ul"
          class="space-y-2"
          handle=".drag-handle"
        >
          <template #item="{ element: account, index }">
            <li class="flex items-center justify-between py-2 border-b border-gray-700 text-white bg-gray-800 rounded px-2">
              <div class="flex items-center space-x-2">
                <span class="cursor-move drag-handle text-gray-400 mr-2" title="Drag">&#9776;</span>
                <!-- Editable Name -->
                <span v-if="!(editingAccount && editingAccount.index === index && editingAccount.field === 'name')"
                      @click="startEdit(index, 'name', account.name)"
                      class="cursor-pointer hover:underline">
                  {{ account.name }}
                </span>
                <input v-else
                       v-model="editValue"
                       @blur="saveEdit(index, 'name')"
                       @keyup.enter="saveEdit(index, 'name')"
                       class="bg-gray-700 text-white rounded px-1 w-24"
                       />
              </div>
              <div class="flex items-center space-x-2">
                <!-- Editable Balance -->
                <span v-if="!(editingAccount && editingAccount.index === index && editingAccount.field === 'balance')"
                      @click="startEdit(index, 'balance', account.balance)"
                      class="cursor-pointer hover:underline">
                  ${{ Number(account.balance).toFixed(2) }}
                </span>
                <input v-else
                       v-model="editValue"
                       type="number"
                       step="0.01"
                       @blur="saveEdit(index, 'balance')"
                       @keyup.enter="saveEdit(index, 'balance')"
                       class="bg-gray-700 text-white rounded px-1 w-20"
                       />
                <button
                  @click="deleteAccount(index)"
                  class="ml-2 text-red-400 hover:text-red-600"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </li>
          </template>
        </draggable>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import AccountBalanceCard from '@/components/cards/AccountBalanceCard.vue';
import SpendingSummaryCard from '@/components/cards/SpendingSummaryCard.vue';
import UpcomingBillsCard from '@/components/cards/UpcomingBillsCard.vue';
import BudgetMathCard from '@/components/cards/BudgetCard.vue';
import WarningModal from '@/components/WarningModal.vue';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable';

const API_URL = import.meta.env.VITE_API_URL;

const cards = ref([]); // Cards array
const accounts = ref<any[]>([]); // Accounts array
const accountName = ref('');
const accountBalance = ref<number | null>(null);
const profileDropdownOpen = ref(false);
const router = useRouter();
const profileImageUrl = ref('https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'); // Example placeholder

// Fetch cards from the API when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/api/cards`);
    cards.value = response.data;
    fetchAccounts(); // Fetch accounts after cards are loaded
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
});

// Fetch accounts from the API when the component is mounted
async function fetchAccounts() {
  try {
    const res = await axios.get(`${API_URL}/api/accounts`);
    accounts.value = res.data;
  } catch (err) {
    console.error('Failed to fetch accounts', err);
  }
}

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

// Add a new account
async function addAccount() {
  if (!accountName.value || accountBalance.value === null) return;

  const newAccount = {
    name: accountName.value,
    balance: accountBalance.value
  };

  try {
    const response = await axios.post(`${API_URL}/api/accounts`, newAccount);
    accounts.value.push(response.data);
    accountName.value = '';
    accountBalance.value = null;
  } catch (error) {
    alert('Failed to add account');
  }
  await fetchAccounts(); // Refresh accounts list after adding
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
  dropdownOpen.value = !dropdown.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

// Initial fetch of accounts
onMounted(() => {
  fetchAccounts();
});

function goToAccountSettings() {
  profileDropdownOpen.value = false;
  router.push('/account-settings'); // Make sure this route exists
}

function logout() {
  profileDropdownOpen.value = false;
  // Add your logout logic here (e.g., clear tokens, redirect)
  router.push('/login');
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.getElementById('profile-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    profileDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

async function deleteAccount(index: number) {
  const account = accounts.value[index];
  console.log('Deleting account:', account);
  if (!account?.id) return;
  try {
    await axios.delete(`${API_URL}/api/accounts/${account.id}`);
    await fetchAccounts(); // Refresh from backend
  } catch (error) {
    alert('Failed to delete account');
  }
}

const editingAccount = ref<{ index: number; field: 'name' | 'balance' } | null>(null);
const editValue = ref('');

function startEdit(index: number, field: 'name' | 'balance', value: string | number) {
  editingAccount.value = { index, field };
  editValue.value = String(value);
}

async function saveEdit(index: number, field: 'name' | 'balance') {
  let updated = false;
  if (field === 'name') {
    const newName = editValue.value.trim();
    if (newName && accounts.value[index].name !== newName) {
      accounts.value[index].name = newName;
      updated = true;
    }
  } else if (field === 'balance') {
    const num = Number(editValue.value);
    if (!isNaN(num) && accounts.value[index].balance !== num) {
      accounts.value[index].balance = num;
      updated = true;
    }
  }

  if (updated) {
    const account = accounts.value[index];
    if (account.id !== undefined && typeof account.id === 'number') {
      try {
        await axios.put(`${API_URL}/api/accounts/${account.id}`, account);
        await fetchAccounts(); // Refresh from backend
      } catch (err) {
        alert('Failed to save changes');
      }
    } else {
      alert('Account ID missing or invalid!');
    }
  }

  editingAccount.value = null;
  editValue.value = '';
}

async function editAccount(index: number) {
  const account = accounts.value[index];
  warningModal.value = {
    visible: true,
    title: 'Edit Account',
    message: 'Enter a new name and balance for the account (format: name,balance):',
    showInput: true,
    onConfirm: (inputValue?: string) => {
      if (inputValue) {
        // Simple parsing: "name,balance"
        const [newName, newBalance] = inputValue.split(',');
        if (newName) account.name = newName.trim();
        if (newBalance && !isNaN(Number(newBalance))) account.balance = Number(newBalance);
      }
      warningModal.value.visible = false;
    },
    onCancel: () => {
      warningModal.value.visible = false;
    }
  };
  await fetchAccounts(); // Refresh accounts list after editing
}
</script>
