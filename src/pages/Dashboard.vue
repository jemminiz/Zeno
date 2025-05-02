<template>
  <div class="min-h-screen bg-gray-800 text-red-300">
    <!-- Topbar -->
    <header class="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <div class="flex items-center space-x-3">
        <img src="@/assets/logo.png" alt="Zeno Logo" class="h-8 w-8" />
        <h1 class="text-2xl font-bold text-red-300">Zeno Dashboard</h1>
      </div>

      <!-- Profile Dropdown -->
      <div class="relative">
        <button
          @click="toggleProfileDropdown"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Profile
        </button>
        <div v-if="profileDropdownOpen">
          <!-- Fullscreen Overlay -->
          <div
            class="fixed inset-0 z-40"
            @click="closeProfileDropdown"
          ></div>

          <!-- Dropdown Menu -->
          <div
            class="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50"
          >
            <button
              @click="editProfile"
              class="block w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              Edit Profile
            </button>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="p-6">
      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="relative p-4 bg-gray-900 rounded shadow text-white"
        >
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
              class=" text-white px-2 py-1 rounded hover:bg-gray-500 bg-customBlue"
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
import { ref } from 'vue'
import AccountBalanceCard from '@/components/cards/AccountBalanceCard.vue'
import SpendingSummaryCard from '@/components/cards/SpendingSummaryCard.vue'
import UpcomingBillsCard from '@/components/cards/UpcomingBillsCard.vue'
import WarningModal from '@/components/WarningModal.vue'
import { useAuth } from '@/utils/auth'

const { logout } = useAuth()

const cards = ref([
  {
    type: 'account-balance',
    props: {
      accountName: 'Checking Account',
      balance: 1234.56,
      lastUpdated: '2023-10-01'
    }
  },
  {
    type: 'spending-summary',
    props: {
      totalSpending: 2000,
      spendingByCategory: { Food: 500, Rent: 1200, Entertainment: 300 }
    }
  },
  {
    type: 'upcoming-bills',
    props: {
      bills: [
        { id: 1, name: 'Electricity', amount: 100, dueDate: '2023-10-10' },
        { id: 2, name: 'Internet', amount: 50, dueDate: '2023-10-15' }
      ]
    }
  }
])

const warningModal = ref({
  visible: false,
  title: '',
  message: '',
  showInput: false,
  onConfirm: () => {},
  onCancel: () => {
    warningModal.value.visible = false
  }
})

const dropdownOpen = ref(false)
const profileDropdownOpen = ref(false)

const cardTypes = [
  { value: 'account-balance', label: 'Account Balance' },
  { value: 'spending-summary', label: 'Spending Summary' },
  { value: 'upcoming-bills', label: 'Upcoming Bills' }
]

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

function toggleProfileDropdown() {
  profileDropdownOpen.value = !profileDropdownOpen.value
}

function closeProfileDropdown() {
  profileDropdownOpen.value = false
}

function addCard(type: string) {
  dropdownOpen.value = false // Close dropdown after selection
  switch (type) {
    case 'account-balance':
      cards.value.push({
        type: 'account-balance',
        props: {
          accountName: 'New Account',
          balance: 0,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      })
      break
    case 'spending-summary':
      cards.value.push({
        type: 'spending-summary',
        props: {
          totalSpending: 0,
          spendingByCategory: {}
        }
      })
      break
    case 'upcoming-bills':
      cards.value.push({
        type: 'upcoming-bills',
        props: {
          bills: []
        }
      })
      break
  }
}

function editProfile() {
  console.log('Edit Profile clicked')
  // Add logic for editing the profile
}

function logOut() {
  console.log('Log Out clicked')
  // Add logic for logging out
}

function editCard(index: number) {
  const card = cards.value[index]

  warningModal.value = {
    visible: true,
    title: 'Edit Card',
    message: 'Enter a new name for the card:',
    showInput: true,
    onConfirm: (inputValue?: string) => {
      if (inputValue) {
        card.props.accountName = inputValue
      }
      warningModal.value.visible = false
    },
    onCancel: () => {
      warningModal.value.visible = false
    }
  }
}

function confirmDeleteCard(index: number) {
  warningModal.value = {
    visible: true,
    title: 'Delete Card',
    message: 'Are you sure you want to delete this card?',
    showInput: false,
    onConfirm: () => {
      deleteCard(index)
      warningModal.value.visible = false
    },
    onCancel: () => {
      warningModal.value.visible = false
    }
  }
}

function deleteCard(index: number) {
  cards.value.splice(index, 1)
}

function getCardComponent(type: string) {
  switch (type) {
    case 'account-balance':
      return AccountBalanceCard
    case 'spending-summary':
      return SpendingSummaryCard
    case 'upcoming-bills':
      return UpcomingBillsCard
    default:
      return null
  }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
