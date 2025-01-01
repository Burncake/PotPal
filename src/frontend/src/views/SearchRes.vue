<template>
  <div class="product-category-container py-5">
    <div class="container">
      <h2 class="text-center mb-4 text-capitalize">Searched Products</h2>
      <div class="border-bottom mb-5"></div>
      <!-- Filter Section -->
      <div class="mb-4 d-flex justify-content-center align-items-center gap-3">
        <!-- Filter by Price -->
        <div class="d-flex flex-column align-items-center">
          <label for="price-range" class="mb-2">Filter by Price</label>
          <select id="price-range" v-model="selectedPriceRange" @change="applyFilters" class="form-select w-auto">
            <option value="">All Prices</option>
            <option value="0-1000">0 - 1000$</option>
            <option value="1000-2000">1000 - 2000$</option>
            <option value="2000-3000">2000 - 3000$</option>
            <option value="3000+">> 3000$</option>
          </select>
        </div>
        <!-- Filter by RAM -->
        <div class="d-flex flex-column align-items-center">
          <label for="ram-range" class="mb-2">Filter by RAM</label>
          <select id="ram-range" v-model="selectedRamRange" @change="applyFilters" class="form-select w-auto">
            <option value="">All RAM Sizes</option>
            <option value="4-8">4GB - 8GB</option>
            <option value="8-16">8GB - 16GB</option>
            <option value="16-32">16GB - 32GB</option>
            <option value=">32">> 32GB</option>
          </select>
        </div>
        <!-- Filter by Storage -->
        <div class="d-flex flex-column align-items-center">
          <label for="storage-range" class="mb-2">Filter by Storage</label>
          <select id="storage-range" v-model="selectedStorageRange" @change="applyFilters" class="form-select w-auto">
            <option value="">All Storage Sizes</option>
            <option value="0-256">0 - 256 GB</option>
            <option value="256-512">256 - 512 GB</option>
            <option value="512-1024">512 GB - 1 TB</option>
            <option value=">1024">> 1 TB</option>
          </select>
        </div>
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
              <p class="card-text p-0 mb-0 mt-3">
                <strong>RAM: {{ product.ram }}</strong>
              </p>
              <p class="card-text p-0 mb-0 mt-3">
                <strong>Storage: {{ product.storage }}</strong>
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
      selectedRamRange: "",
      selectedStorageRange: "", // Thêm trường lưu trữ
    };
  },
  watch: {
    '$route.query.pattern'(newPattern) {
      this.search(newPattern);
    },
    '$route.query.price'(newPriceRange) {
      this.selectedPriceRange = newPriceRange;
      this.filterProducts();
    },
    '$route.query.ram'(newRamRange) {
      this.selectedRamRange = newRamRange;
      this.filterProducts();
    },
    '$route.query.storage'(newStorageRange) {
      this.selectedStorageRange = newStorageRange;
      this.filterProducts();
    },
  },
  async mounted() {
    await this.fetchProducts();
    const pattern = this.$route.query.pattern || '';
    const priceRange = this.$route.query.price || '';
    const ramRange = this.$route.query.ram || '';
    const storageRange = this.$route.query.storage || ''; // Lấy giá trị storage từ query
    this.selectedPriceRange = priceRange;
    this.selectedRamRange = ramRange;
    this.selectedStorageRange = storageRange;
    this.search(pattern);
  },
  methods: {
    async fetchProducts() {
      try {
        const productsResponse = await fetch(
          'http://localhost:3000/product/general/all'
        );
        const productsData = await productsResponse.json();
        // Extract the actual product data from the API response
        this.products = productsData.data;
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
      this.filterProducts();
    },
    applyFilters() {
      const priceRange = this.selectedPriceRange;
      const ramRange = this.selectedRamRange;
      const storageRange = this.selectedStorageRange;

      // Cập nhật query của URL
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          price: priceRange || undefined,
          ram: ramRange || undefined,
          storage: storageRange || undefined,
        },
      });

      // Áp dụng bộ lọc
      this.filterProducts();
    },
    filterProducts() {
      const priceRange = this.selectedPriceRange;
      const ramRange = this.selectedRamRange;
      const storageRange = this.selectedStorageRange;

      let result = this.searchedProd;

      // Lọc theo giá
      if (priceRange) {
        if (priceRange === '3000+') {
          result = result.filter((product) => parseFloat(product.price) > 3000);
        } else {
          const [minPrice, maxPrice] = priceRange.split('-').map(Number);
          result = result.filter((product) => {
            const price = parseFloat(product.price);
            return maxPrice
              ? price >= minPrice && price <= maxPrice
              : price >= minPrice;
          });
        }
      }

      // Lọc theo RAM
      if (ramRange) {
        const parseRam = (ramStr) => parseInt(ramStr.replace(/\D/g, ""));
        result = result.filter((product) => {
          const ram = parseRam(product.ram);
          if (ramRange === '<=4') return ram <= 4;
          if (ramRange === '>32') return ram > 32;
          const [minRam, maxRam] = ramRange.split('-').map(Number);
          return ram >= minRam && ram <= maxRam;
        });
      }

      // Lọc theo Storage
      if (storageRange) {
        const parseStorage = (storageStr) => {
          // Kiểm tra nếu có "TB" trong chuỗi và chuyển đổi về GB
          if (storageStr.includes('TB')) {
            const valueInTB = parseFloat(storageStr.replace('TB', '').trim());
            return valueInTB * 1024; // Chuyển đổi TB thành GB
          }
          // Nếu không có "TB", chuyển đổi trực tiếp từ GB
          return parseInt(storageStr.replace(/[^\d]/g, ""));
        };

        result = result.filter((product) => {
          const storage = parseStorage(product.storage); // Áp dụng hàm mới xử lý TB -> GB

          if (storageRange === '>1024') return storage > 1024;
          const [minStorage, maxStorage] = storageRange.split('-').map(Number);
          return storage >= minStorage && storage <= maxStorage;
        });
      }

      this.filteredProd = result;
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
