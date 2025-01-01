<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <AdminSidebar />

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
                <th class="admin-th w-[30%]">Category</th>
                <th class="admin-th w-[40%]">Description</th>
                <th class="admin-th w-[20%]">Parent Category</th>
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
                <td class="admin-td">{{ category.description }}</td>
                <td class="admin-td">{{ getParentCategoryName(category.parentID) }}</td>
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
            <label for="description" class="admin-label">Description</label>
            <textarea v-model="currentCategory.description" id="description" rows="3" class="admin-textarea"></textarea>
          </div>
          <div class="admin-form-group">
            <label for="parentID" class="admin-label">Parent Category</label>
            <select v-model="currentCategory.parentID" id="parentID" class="admin-input">
              <option value="">None</option>
              <option v-for="cat in categories"
                      :key="cat.catID"
                      :value="cat.catID"
                      :disabled="cat.catID === currentCategory.catID">
                {{ cat.catName }}
              </option>
            </select>
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
import '@/assets/styles/admin-layout.css'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import { PlusIcon, EditIcon, TrashIcon, HomeIcon, BoxIcon, FolderIcon, ShoppingCartIcon, UsersIcon, BarChartIcon, SettingsIcon } from 'lucide-vue-next'

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

const getParentCategoryName = (parentID) => {
  if (!parentID) return 'None'
  const parent = categories.value.find(cat => cat.catID === parentID)
  return parent ? parent.catName : 'Unknown'
}

const openModal = (mode, category = {}) => {
  modalMode.value = mode;
  currentCategory.value = mode === 'edit' ? { ...category } : {
    catName: '',
    description: '',
    parentID: ''
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
