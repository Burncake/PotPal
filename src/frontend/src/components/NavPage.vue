<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-light bg-white shadow-sm">
    <div class="container p-2">
      <router-link class="navbar-brand" to="/">PotPal</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
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
              <!-- Display loading message or error if needed -->
              <li v-if="loading">Loading categories...</li>
              <li v-if="error">{{ errorMessage }}</li>
              <li v-for="(category, index) in categories" :key="index">
                <router-link
                  class="dropdown-item text-capitalize"
                  :to="'/category/' + category.catID"
                >
                  {{ category.catName }}
                </router-link>
              </li>
            </ul>
          </div>
          <router-link class="nav-link" to="/about">About Us</router-link>
          <router-link class="nav-link" to="/contact">Contact Us</router-link>
          <router-link class="nav-link" to="/login">Login</router-link>
          <router-link class="nav-link" to="/register">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      loading: false,
      error: false,
      errorMessage: '',
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    fetchCategories() {
      this.loading = true
      fetch('https://6754193836bcd1eec85023b2.mockapi.io/api/category')
        .then((response) => response.json())
        .then((data) => {
          this.categories = data
          this.loading = false
        })
        .catch((error) => {
          this.error = true
          this.errorMessage = 'Error fetching categories'
          this.loading = false
        })
    },
  },
}
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
</style>