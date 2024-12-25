<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { HomeIcon, BoxIcon, FolderIcon, ShoppingCartIcon, UsersIcon, BarChartIcon, SettingsIcon } from 'lucide-vue-next'
var currentSection = ref('')
const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: BoxIcon },
  { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
]
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
