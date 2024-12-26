<template>
  <div class="admin-layout">
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

    <main class="admin-content">
      <h1>Customer Information</h1>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-for="user in users" :key="user.userID" class="user-card">
          <img :src="user.avatar" alt="Avatar" class="user-avatar" />
          <div class="user-info">
            <p><strong>User ID:</strong> {{ user.userID }}</p>
            <p><strong>Full Name:</strong> {{ user.fullName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Address:</strong> {{ user.address }}</p>
            <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Status:</strong> {{ user.userStatus }}</p>
            <p><strong>Tokens:</strong> {{ user.tokens }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import { HomeIcon, BoxIcon, FolderIcon, ShoppingCartIcon, UsersIcon, BarChartIcon, SettingsIcon } from 'lucide-vue-next';

export default {
  data() {
    return {
      users: [],
      loading: true,
      currentSection: 'Customers',
      navigationItems: [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Products', href: '/admin/products', icon: BoxIcon },
        { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
        { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
        { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
      ],
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await fetch('https://67628fc046efb373237507fb.mockapi.io/user');
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
}

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

.admin-content {
  flex-grow: 1;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading {
  font-size: 18px;
  color: #666;
}

.user-card {
  display: flex;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-info p {
  margin: 5px 0;
}

.user-info strong {
  font-weight: bold;
}
</style>
