<template>
    <div class="admin-layout">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar">
        <div class="admin-nav-container">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="admin-nav-item"
            :class="{ 'admin-nav-item-active': currentSection === item.name }"
            @click.prevent="currentSection = item.name"
          >
            <component :is="item.icon" class="admin-nav-icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </aside>
  
      <!-- Main Content -->
      <div class="admin-content">
        <main class="admin-main">
          <div class="admin-header">
            <h2 class="admin-page-title">Categories</h2>
            <button 
              @click="openModal('add')"
              class="admin-button"
            >
              <PlusIcon class="admin-button-icon" />
              Add Category
            </button>
          </div>
  
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th class="admin-th w-[40%]">Category</th>
                  <th class="admin-th w-[20%]">Description</th>
                  <th class="admin-th w-[15%]"></th>
                  <th class="admin-th w-[15%]"></th>
                  <th class="admin-th w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.catID" class="admin-tr">
                  <td class="admin-td">
                    <div class="admin-category-cell">
                      <div>
                        <div class="admin-category-name">{{ category.catName }}</div>
                        <div class="admin-category-id">ID: {{ category.catID }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="admin-td">
                    <div class="admin-category-description">{{ category.catDescription }}</div>
                  </td>
                  <td class="admin-td"></td>
                  <td class="admin-td"></td>
                  <td class="admin-td text-right">
                    <button @click="openModal('edit', category)" class="admin-action-button text-blue-600">
                      <EditIcon class="admin-action-icon" />
                    </button>
                    <button @click="deleteCategory(category.catID)" class="admin-action-button text-red-600">
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
          <h2 class="admin-modal-title">{{ modalMode === 'add' ? 'Add New Category' : 'Edit Category' }}</h2>
          <form @submit.prevent="submitForm" class="admin-form">
            <div class="admin-form-group">
              <label for="catName" class="admin-label">Category Name</label>
              <input v-model="currentCategory.catName" id="catName" type="text" required class="admin-input">
            </div>
            <div class="admin-form-group">
              <label for="catDescription" class="admin-label">Category Description</label>
              <textarea v-model="currentCategory.catDescription" id="catDescription" class="admin-textarea admin-input"></textarea>
            </div>
            <div class="admin-modal-footer">
              <button type="button" @click="closeModal" class="admin-button-secondary">
                Cancel
              </button>
              <button type="submit" class="admin-button-primary">
                {{ modalMode === 'add' ? 'Add Category' : 'Update Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { PlusIcon, EditIcon, TrashIcon, HomeIcon, BoxIcon, FolderIcon, ShoppingCartIcon, UsersIcon, BarChartIcon, SettingsIcon } from 'lucide-vue-next'
  
  const currentSection = ref('Categories')
  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: BoxIcon },
    { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ]
  
  const categories = ref([])
  const showModal = ref(false)
  const modalMode = ref('add')
  const currentCategory = ref({})
  
  const apiUrl = 'https://6754193836bcd1eec85023b2.mockapi.io/api/category'
  
  onMounted(async () => {
    await fetchCategories()
  })
  
  const fetchCategories = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      categories.value = await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const openModal = (mode, category = {}) => {
    modalMode.value = mode;
    currentCategory.value = mode === 'edit' ? { ...category } : {
      catName: '',
      catDescription: ''
    };
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false
    currentCategory.value = {}
  }
  
  const submitForm = async () => {
    try {
      const method = modalMode.value === 'add' ? 'POST' : 'PUT'
      const url = modalMode.value === 'add' ? apiUrl : `${apiUrl}/${currentCategory.value.catID}`
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCategory.value),
      })
  
      if (!response.ok) throw new Error('Network response was not ok')
      
      await fetchCategories()
      closeModal()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  
  const deleteCategory = async (catID) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${apiUrl}/${catID}`, {
          method: 'DELETE',
        })
  
        if (!response.ok) throw new Error('Network response was not ok')
        
        await fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    min-height: calc(100vh - 60px); /* Adjust based on your navbar height */
    background-color: #f8f9fa;
  }
  
  .admin-sidebar {
    width: 250px;
    background: white;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  
  .admin-sidebar-header {
    padding: 1.25rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .admin-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .admin-nav-container {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
  }
  
  .admin-nav-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: #4b5563;
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .admin-nav-item:hover {
    background-color: #f3f4f6;
  }
  
  .admin-nav-item-active {
    background-color: #f3f4f6;
    color: #2563eb;
  }
  
  .admin-nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
  }
  
  .admin-content {
    flex: 1;
    overflow: auto;
  }
  
  .admin-main {
    padding: 1.5rem;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .admin-page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }
  
  .admin-button {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #2563eb;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .admin-button:hover {
    background-color: #1d4ed8;
  }
  
  .admin-button-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
  
  .admin-table-container {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .admin-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .admin-th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .admin-tr {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .admin-tr:hover {
    background-color: #f9fafb;
  }
  
  .admin-td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #111827;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .admin-category-cell {
    display: flex;
    flex-direction: column;
  }
  
  .admin-category-name {
    font-weight: 500;
    color: #111827;
  }
  
  .admin-category-id {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .admin-category-description {
    font-size: 0.875rem;
    color: #4b5563;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
  
  .admin-action-button {
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .admin-action-button:hover {
    background-color: #f3f4f6;
  }
  
  .admin-action-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .admin-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .admin-modal {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 32rem;
    margin: 0 1rem;
    max-height: 80vh; 
    overflow-y: auto; 
  }
  
  .admin-modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.5rem;
  }
  
  .admin-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .admin-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .admin-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .admin-input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  .admin-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  .admin-textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .admin-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .admin-button-secondary {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    color: #374151;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .admin-button-secondary:hover {
    background-color: #e5e7eb;
  }
  
  .admin-button-primary {
    padding: 0.5rem 1rem;
    background-color: #2563eb;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .admin-button-primary:hover {
    background-color: #1d4ed8;
  }
  </style>

