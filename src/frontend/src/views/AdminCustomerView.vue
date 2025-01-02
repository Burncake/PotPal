<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="admin-content">
      <main class="admin-main">
        <div class="admin-header">
          <h2 class="admin-page-title">Customers</h2>
          <button 
            @click="openModal('add')"
            class="admin-button"
          >
            <PlusIcon class="admin-button-icon" />
            Add Customer
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="admin-th w-[40%]">Customer</th>
                <th class="admin-th w-[20%]">Email</th>
                <th class="admin-th w-[15%]">Role</th>
                <th class="admin-th w-[15%]">Status</th>
                <th class="admin-th w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.userID" class="admin-tr">
                <td class="admin-td">
                  <div class="admin-product-cell">
                    <img :src="user.avatar" alt="" class="admin-product-image">
                    <div>
                      <div class="admin-product-name">{{ user.fullName }}</div>
                      <div class="admin-product-id">ID: {{ user.userID }}</div>
                    </div>
                  </div>
                </td>
                <td class="admin-td">{{ user.email }}</td>
                <td class="admin-td">{{ user.role }}</td>
                <td class="admin-td">
                  <span :class="getStatusClass(user.userStatus)">
                    {{ user.userStatus }}
                  </span>
                </td>
                <td class="admin-td text-right">
                  <button @click="openModal('edit', user)" class="admin-action-button text-blue-600">
                    <EditIcon class="admin-action-icon" />
                  </button>
                  <button @click="deleteCustomer(user.userID)" class="admin-action-button text-red-600">
                    <TrashIcon class="admin-action-icon" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="admin-modal-overlay">
      <div class="admin-modal">
        <h2 class="admin-modal-title">{{ modalMode === 'add' ? 'Add New Customer' : 'Edit Customer' }}</h2>
        <form @submit.prevent="submitForm" class="admin-form">
          <div class="admin-form-group">
            <label for="fullName" class="admin-label">Full Name</label>
            <input v-model="currentUser.fullName" id="fullName" type="text" required class="admin-input">
          </div>
          <div class="admin-form-group">
            <label for="email" class="admin-label">Email</label>
            <input v-model="currentUser.email" id="email" type="email" required class="admin-input">
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="role" class="admin-label">Role</label>
              <select v-model="currentUser.role" id="role" class="admin-input" required>
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="userStatus" class="admin-label">Status</label>
              <select v-model="currentUser.userStatus" id="userStatus" class="admin-input" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="admin-form-group">
            <label for="address" class="admin-label">Address</label>
            <textarea v-model="currentUser.address" id="address" rows="3" class="admin-textarea"></textarea>
          </div>
          <div class="admin-form-group">
            <label for="phoneNumber" class="admin-label">Phone Number</label>
            <input v-model="currentUser.phoneNumber" id="phoneNumber" type="tel" class="admin-input">
          </div>
          <div class="admin-form-group">
            <label for="avatar" class="admin-label">Avatar URL</label>
            <input v-model="currentUser.avatar" id="avatar" type="url" class="admin-input" placeholder="https://example.com/avatar.jpg">
          </div>
          <div class="admin-modal-footer">
            <button type="button" @click="closeModal" class="admin-button-secondary">
              Cancel
            </button>
            <button type="submit" class="admin-button-primary">
              {{ modalMode === 'add' ? 'Add Customer' : 'Update Customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/admin-layout.css'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-vue-next'

const users = ref([])
const showModal = ref(false)
const modalMode = ref('add')
const currentUser = ref({})

const apiUrl = 'https://67628fc046efb373237507fb.mockapi.io/user'

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Network response was not ok')
    users.value = await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const getStatusClass = (status) => {
  const baseClasses = 'admin-status-badge'
  switch (status) {
    case 'Active':
      return `${baseClasses} admin-status-available`
    case 'Inactive':
      return `${baseClasses} admin-status-outofstock`
    default:
      return `${baseClasses} admin-status-default`
  }
}

const openModal = (mode, user = {}) => {
  modalMode.value = mode;
  currentUser.value = mode === 'edit' ? { ...user } : {
    fullName: '',
    email: '',
    role: 'Customer',
    userStatus: 'Active',
    address: '',
    phoneNumber: '',
    avatar: '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false
  currentUser.value = {}
}

const submitForm = async () => {
  try {
    const method = modalMode.value === 'add' ? 'POST' : 'PUT'
    const url = modalMode.value === 'add' ? apiUrl : `${apiUrl}/${currentUser.value.userID}`
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser.value),
    })

    if (!response.ok) throw new Error('Network response was not ok')
    
    await fetchUsers()
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const deleteCustomer = async (userID) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    try {
      const response = await fetch(`${apiUrl}/${userID}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Network response was not ok')
      
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
}
</script>
