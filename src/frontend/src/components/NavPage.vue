<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-light bg-white shadow-sm">
    <div class="container p-2">
      <router-link class="navbar-brand col-md-1 col-xxl-2" to="/">PotPal</router-link>

      <form class="d-flex col-5 col-md-4 col-xxl-3" @submit.prevent="search">
        <input
          list="laptopOptions"
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          v-model="searchQuery"
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <datalist id="laptopOptions">
          <option v-for="prod in products" :value="prod.prodName" :key="prod.prodID"></option>
        </datalist>
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse col-6 col-md-5 col-xxl-4" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <router-link class="nav-link" to="/">Home</router-link>
          <div class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categories
            </a>
            <ul class="dropdown-menu" id="categoryDropdown">
              <li v-if="loading">Loading categories...</li>
              <li v-if="error">{{ errorMessage }}</li>
              <template v-for="(category, index) in categories" :key="index">
                <li v-if="!category.children || category.children.length === 0">
                  <router-link
                    class="dropdown-item text-capitalize"
                    :to="'/category/' + category.catID"
                  >
                    {{ category.catName }}
                  </router-link>
                </li>
                <li v-else class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#">
                    {{ category.catName }}
                  </a>
                  <ul class="dropdown-menu">
                    <li
                      v-for="(subCategory, subIndex) in category.children"
                      :key="subIndex"
                    >
                      <router-link
                        class="dropdown-item text-capitalize"
                        :to="'/category/' + subCategory.catID"
                      >
                        {{ subCategory.catName }}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </template>
            </ul>
          </div>
          <router-link class="nav-link" to="/about">About Us</router-link>
          <router-link class="nav-link" to="/contact">Contact Us</router-link>
          <router-link class="nav-link" to="/cart">Cart</router-link>
          <router-link class="nav-link" to="/orders">My Order</router-link>
          <template v-if="!this.userStore.isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
            <router-link class="nav-link" to="/register">Register</router-link>
          </template>
          <template v-else>
            <router-link class="nav-link" to="/profile">Profile</router-link>
            <a class="nav-link" href="#" @click="logOut">Logout</a>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { UserStore } from '@/store/User';

export default {
  data() {
    return {
      categories: [],
      loading: false,
      error: false,
      errorMessage: '',
      products: [],
      searchQuery: '',
      userStore: UserStore(),
    };
  },

  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  },

  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/category/tree');
        const data = await response.json();

        // Sử dụng dữ liệu cây danh mục từ API
        this.categories = data.data;
        this.loading = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = 'Error fetching categories';
        this.loading = false;
      }
    },

    async fetchProducts() {
      this.loading = true;
      try {
        const response = await fetch('https://6754193836bcd1eec85023b2.mockapi.io/api/products');
        const data = await response.json();
        this.products = data;
        this.loading = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = 'Error fetching products';
        this.loading = false;
      }
    },

    search() {
      this.$router.replace({path: 'search', query: {pattern: this.searchQuery}});
    },

    logOut() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      this.userStore.$reset();
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.nav-link {
  font-weight: 500;
}

.nav-link:hover {
  color: #000;
}

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -0.5rem;
  display: none;
}

.dropdown-submenu:hover .dropdown-menu {
  display: block;
}
</style>
