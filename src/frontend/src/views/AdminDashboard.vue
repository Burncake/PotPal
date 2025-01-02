<template>
  <div class="admin-dashboard">
    <!-- Horizontal Menu -->
    <div class="admin-menu">
      <div class="admin-nav-container">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          class="admin-nav-item"
          :class="{ 'admin-nav-item-active': currentSection === item.name }"
          @click.prevent="currentSection = item.name"
        >
          <div class="admin-nav-icon-container">
            <img :src="item.icon" class="admin-nav-icon" alt="icon" />
          </div>
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="admin-main-content">
      <div class="admin-welcome-message">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Your central hub for managing all aspects of the system. Navigate through the sections to view and manage data related to products, orders, customers, and more.</p>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: 'https://png.pngtree.com/png-vector/20221110/ourmid/pngtree-thin-line-house-icon-isolated-on-white-background-vector-png-image_40618990.jpg' },
  { name: 'Products', href: '/admin/products', icon: 'https://www.shutterstock.com/image-vector/simple-clean-laptop-icon-notebook-260nw-1429312172.jpg' },
  { name: 'Categories', href: '/admin/categories', icon: 'https://www.shutterstock.com/image-vector/category-icon-flat-illustration-vector-600nw-2431883211.jpg' },
  { name: 'Orders', href: '/admin/orders', icon: 'https://t4.ftcdn.net/jpg/02/27/73/93/360_F_227739395_BhszneMcufcAe9DJEBTHFFxVJM1PR8RT.jpg' },
  { name: 'Customers', href: '/admin/customers', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJlUe5QjsmfcQiaRcSBKl5TO4SsHT993cc6A&s' },
  { name: 'Analytics', href: '/admin/analytics', icon: 'https://png.pngtree.com/png-vector/20190302/ourmid/pngtree-analytics-icon-design-template-vector-isolated-png-image_745937.jpg' },
  { name: 'Settings', href: '/admin/settings', icon: 'https://static-00.iconduck.com/assets.00/settings-icon-2048x2046-cw28eevx.png' },
]

const currentSection = ref('')
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: space-between;
  font-family: 'Arial', sans-serif;
}

.admin-menu {
  background: #ffffff;
  border-bottom: 2px solid #e5e7eb;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-nav-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2rem;
  justify-items: center;
  align-items: center;
}

.admin-nav-item {
  display: flex;
  flex-direction: column; /* Stack the icon above the text */
  align-items: center;
  padding: 0.75rem 2rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: transform 0.3s ease, background-color 0.2s ease;
}

.admin-nav-item:hover {
  background-color: #f9fafb;
  transform: translateY(-5px); /* Lift the item up on hover */
}

.admin-nav-item-active {
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 600;
}

.admin-nav-icon-container {
  margin-bottom: 0.75rem; /* Add space between the icon and the text */
}

.admin-nav-icon {
  width: 2.25rem; /* Increase the icon size */
  height: 2.25rem;
}

.admin-main-content {
  padding: 2rem;
  background: #f9fafb;
  width: 100%;
  border-radius: 8px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.admin-welcome-message {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-welcome-message h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.admin-welcome-message p {
  font-size: 1.125rem;
  color: #666;
}

@media (max-width: 768px) {
  .admin-nav-container {
    grid-template-columns: 1fr 1fr 1fr; /* Stack menu items into 3 columns for mobile */
    gap: 1.5rem;
  }
  
  .admin-nav-item {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-nav-container {
    grid-template-columns: 1fr 1fr; /* Stack menu items into 2 columns for smaller screens */
  }
}
</style>
