<template>
  <div class="product-category-container py-5">
    <div class="container">
      <h2 class="text-center mb-4 text-capitalize">Searched Products</h2>
      <div class="border-bottom mb-5"></div>
      <!-- Filter Section -->
      <div class="mb-4 d-flex justify-content-center flex-column align-items-center">
        <label for="price-range" class="mb-2">Filter by Price</label>
        <select id="price-range" v-model="selectedPriceRange" @change="applyFilters" class="form-select w-auto">
          <option value="">All Prices</option>
          <option value="0-1000">0 - 1000$</option>
          <option value="1000-2000">1000 - 2000$</option>
          <option value="2000-3000">2000 - 3000$</option>
          <option value="3000+">> 3000$</option>
        </select>
      </div>
      <!-- Product Grid -->
      <div class="row">
        <div v-for="(product, index) in filteredProd" :key="index" class="col-md-3 mb-5">
          <div class="card p-3 h-100 border-0 shadow-sm">
            <div class="card-img">
              <img :src="product.mainImage" alt="Product Image" />
            </div>
            <div class="card-body align-self-bottom">
              <h6 class="card-title">
                <router-link :to="'/product/' + product.prodID">{{ product.prodName }}</router-link>
              </h6>
              <p class="card-text p-0 mb-0 mt-3">
                <strong>Price: ${{ product.price }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [], // Danh sách tất cả sản phẩm
      searchedProd: [], // Sản phẩm khớp với tìm kiếm
      filteredProd: [], // Sản phẩm khớp với bộ lọc
      selectedPriceRange: "",
    };
  },
  watch: {
    '$route.query.pattern'(newPattern) {
      this.search(newPattern);
    },
    '$route.query.price'(newPriceRange) {
      this.selectedPriceRange = newPriceRange;
      this.filterByPrice(newPriceRange);
    },
  },
  async mounted() {
    await this.fetchProducts();
    const pattern = this.$route.query.pattern || '';
    const priceRange = this.$route.query.price || '';
    this.selectedPriceRange = priceRange;
    this.search(pattern);
  },
  methods: {
    async fetchProducts() {
      try {
        const productsResponse = await fetch(
          `https://6754193836bcd1eec85023b2.mockapi.io/api/products`
        );
        const productsData = await productsResponse.json();
        this.products = productsData;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    search(pattern) {
      if (!pattern) {
        this.searchedProd = this.products;
      } else {
        const regex = new RegExp(pattern, 'i');
        this.searchedProd = this.products.filter((item) =>
          regex.test(item.prodName)
        );
      }
      this.filterByPrice(this.selectedPriceRange);
    },
    applyFilters() {
      const priceRange = this.selectedPriceRange;

      // Cập nhật query của URL
      if (priceRange) {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            price: priceRange,
          },
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            price: undefined,
          },
        });
      }

      this.filterByPrice(priceRange);
    },
    filterByPrice(priceRange) {
      if (!priceRange) {
        this.filteredProd = this.searchedProd; // Hiển thị tất cả searchedProd nếu không có bộ lọc
        return;
      }

      if (priceRange === '3000+') {
        this.filteredProd = this.searchedProd.filter(
          (product) => parseFloat(product.price) > 3000
        );
      } else {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        this.filteredProd = this.searchedProd.filter((product) => {
          const price = parseFloat(product.price);
          if (maxPrice) {
            return price >= minPrice && price < maxPrice;
          } else {
            return price >= minPrice;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.product-category-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 60px 0;
}

.product-card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow-sm: 0 0 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.card-title {
  font-size: 1.1rem;
  color: #007bff;
}

.card-text {
  font-size: 1rem;
  color: #333;
}

a {
  text-decoration: none;
  color: #000;
}

a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.card-text {
  font-weight: 300;
}

.border-bottom {
  width: 200px;
  margin: auto;
}

.card-img {
  text-align: center;
}

.card-body {
  position: relative;
  bottom: 0;
}

img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.star-rating {
  font-size: 15px;
  color: #ffd700;
}
</style>
