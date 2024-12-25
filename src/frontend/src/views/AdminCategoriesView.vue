<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="admin-content">
      <main class="admin-main">
        <div class="admin-header">
          <h2 class="admin-page-title">Products</h2>
          <button 
            @click="openModal('add')"
            class="admin-button"
          >
            <PlusIcon class="admin-button-icon" />
            Add Product
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="admin-th w-[40%]">Product</th>
                <th class="admin-th w-[20%]">Price</th>
                <th class="admin-th w-[15%]">Stock</th>
                <th class="admin-th w-[15%]">Status</th>
                <th class="admin-th w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.prodID" class="admin-tr">
                <td class="admin-td">
                  <div class="admin-product-cell">
                    <img :src="product.mainImage" alt="" class="admin-product-image">
                    <div>
                      <div class="admin-product-name">{{ product.prodName }}</div>
                      <div class="admin-product-id">ID: {{ product.prodID }}</div>
                    </div>
                  </div>
                </td>
                <td class="admin-td">{{ formatPrice(product.price) }}</td>
                <td class="admin-td">{{ product.stock }}</td>
                <td class="admin-td">
                  <span :class="getStatusClass(product.prodStatus)">
                    {{ product.prodStatus }}
                  </span>
                </td>
                <td class="admin-td text-right">
                  <button @click="openModal('edit', product)" class="admin-action-button text-blue-600">
                    <EditIcon class="admin-action-icon" />
                  </button>
                  <button @click="deleteProduct(product.prodID)" class="admin-action-button text-red-600">
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
        <h2 class="admin-modal-title">{{ modalMode === 'add' ? 'Add New Product' : 'Edit Product' }}</h2>
        <form @submit.prevent="submitForm" class="admin-form">
          <div class="admin-form-group">
            <label for="prodName" class="admin-label">Product Name</label>
            <input v-model="currentProduct.prodName" id="prodName" type="text" required class="admin-input">
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="price" class="admin-label">Price</label>
              <input v-model="currentProduct.price" id="price" type="number" step="0.01" required class="admin-input">
            </div>
            <div class="admin-form-group">
              <label for="stock" class="admin-label">Stock</label>
              <input v-model="currentProduct.stock" id="stock" type="number" required class="admin-input">
            </div>
          </div>
          <div class="admin-form-group">
            <label for="description" class="admin-label">Description</label>
            <textarea v-model="currentProduct.description" id="description" rows="3" class="admin-textarea"></textarea>
          </div>

          <div class="admin-form-group">
          <label class="admin-label">Product Status</label>
          <div class="flex gap-4">
            <label>
              <input
                type="radio"
                v-model="currentProduct.prodStatus"
                value="Available"
                class="admin-radio-input"
              />
              Available
            </label>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <label>
              <input
                type="radio"
                v-model="currentProduct.prodStatus"
                value="Unavailable"
                class="admin-radio-input"
              />
              Unavailable
            </label>
          </div>
        </div>
        <div class="admin-form-group">
          <label for="category" class="admin-label">Category</label>
          <select v-model="currentProduct.catID" id="category" class="admin-input" required>
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category.catID" :value="category.catID">
              {{ category.catName }}
            </option>
          </select>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label for="processor" class="admin-label">Processor</label>
            <input v-model="currentProduct.processor" id="processor" type="text" class="admin-input" placeholder="e.g., Intel i5">
          </div>
          <div class="admin-form-group">
            <label for="ram" class="admin-label">RAM</label>
            <input v-model="currentProduct.ram" id="ram" type="text" class="admin-input" placeholder="e.g., 8GB">
          </div>
          <div class="admin-form-group">
            <label for="storage" class="admin-label">Storage</label>
            <input v-model="currentProduct.storage" id="storage" type="text" class="admin-input" placeholder="e.g., 256GB SSD">
          </div>
        </div>

          <div class="admin-form-group">
            <label for="mainImage" class="admin-label">Image URL</label>
            <input v-model="currentProduct.mainImage" id="mainImage" type="url" class="admin-input" placeholder="https://example.com/image.jpg">
          </div>
          <div class="admin-modal-footer">
            <button type="button" @click="closeModal" class="admin-button-secondary">
              Cancel
            </button>
            <button type="submit" class="admin-button-primary">
              {{ modalMode === 'add' ? 'Add Product' : 'Update Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import { PlusIcon, EditIcon, TrashIcon, HomeIcon, BoxIcon, FolderIcon, ShoppingCartIcon, UsersIcon, BarChartIcon, SettingsIcon } from 'lucide-vue-next'

const currentSection = ref('Products')
const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: BoxIcon },
  { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
]

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const modalMode = ref('add')
const currentProduct = ref({})

const apiUrl = 'https://6754193836bcd1eec85023b2.mockapi.io/api/products'
const categoryApiUrl = 'https://6754193836bcd1eec85023b2.mockapi.io/api/category'

onMounted(async () => {
  await fetchProducts()
  await fetchCategories()
})

const fetchProducts = async () => {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Network response was not ok')
    products.value = await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch(categoryApiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    categories.value = await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const getStatusClass = (status) => {
  const baseClasses = 'admin-status-badge'
  switch (status) {
    case 'Available':
      return `${baseClasses} admin-status-available`
    case 'Out of Stock':
      return `${baseClasses} admin-status-outofstock`
    default:
      return `${baseClasses} admin-status-default`
  }
}

const openModal = (mode, product = {}) => {
  modalMode.value = mode;
  currentProduct.value = mode === 'edit' ? { ...product } : {
    prodName: '',
    price: '',
    stock: '',
    prodStatus: 'Available',
    mainImage: '',
    description: '',
    catID: '',
    processor: '',
    ram: '',
    storage: '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false
  currentProduct.value = {}
}

const submitForm = async () => {
  try {
    const method = modalMode.value === 'add' ? 'POST' : 'PUT'
    const url = modalMode.value === 'add' ? apiUrl : `${apiUrl}/${currentProduct.value.prodID}`
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentProduct.value),
    })

    if (!response.ok) throw new Error('Network response was not ok')
    
    await fetchProducts()
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const deleteProduct = async (prodID) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`${apiUrl}/${prodID}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Network response was not ok')
      
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
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

.admin-content {
  flex: 1;
  overflow: auto;
}

.admin-main {
  width: 502px;
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
}

.admin-product-cell {
  display: flex;
  align-items: center;
}

.admin-product-image {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
  object-fit: cover;
  margin-right: 0.75rem;
}

.admin-product-name {
  font-weight: 500;
  color: #111827;
}

.admin-product-id {
  font-size: 0.75rem;
  color: #6b7280;
}

.admin-status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.admin-status-available {
  background-color: #dcfce7;
  color: #166534;
}

.admin-status-outofstock {
  background-color: #fee2e2;
  color: #991b1b;
}

.admin-status-default {
  background-color: #f3f4f6;
  color: #374151;
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

.admin-form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 6rem;
  transition: border-color 0.2s;
}

.admin-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
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

.admin-modal {
  max-height: 80vh; 
  overflow-y: auto; 
}

.admin-td {
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
};

</style>
