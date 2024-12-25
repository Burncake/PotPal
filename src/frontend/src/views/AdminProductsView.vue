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
import '@/assets/styles/admin-layout.css'
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

<style>
.admin-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
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
</style>
