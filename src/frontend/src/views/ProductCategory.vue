<template>
  <div class="product-category-container py-5">
    <div class="container">
      <h2 class="text-center mb-4 text-capitalize">Products in {{ category.catName }}</h2>
      <div class="border-bottom mb-5"></div>
      <div class="row">
        <div v-for="(product, index) in products" :key="index" class="col-md-3 mb-5">
          <div class="card p-3 h-100 border-0 shadow-sm">
            <div class="card-img">
              <img :src="product.mainImage" alt="Product Image">
            </div>
            <div class="card-body align-self-bottom">
              <h6 class="card-title">
                <router-link :to="'/product/' + product.prodID">{{ product.prodName }}</router-link>
              </h6>
              <p class="card-text p-0 mb-0 mt-3"><strong>Price: ${{ product.price }}</strong></p>
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
      category: {},
      products: []
    };
  },
  async created() {
    this.catID = this.$route.params.catID;
    await this.fetchCategoryAndProducts();
  },
  watch: {
    '$route.params.catID': 'fetchCategoryAndProducts'
  },
  methods: {
    async fetchCategoryAndProducts() {
      try {
        const categoryId = this.$route.params.catID;

        // Fetch the category details
        const categoryResponse = await fetch(`http://localhost:3000/product/category/${categoryId}`);
        const categoryData = await categoryResponse.json();

        if (categoryData.status === "success") {
          this.category = { catName: categoryData.data.catName };  // Set the category name correctly
          this.products = categoryData.data.products;  // Use the 'products' array correctly
        } else {
          console.error('Category not found');
          return;
        }
      } catch (error) {
        console.error('Error fetching category or products:', error);
      }
    }
  }
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
  color: #FFD700;
}
</style>
