<template>
  <div class="container mt-5">
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div v-if="product" class="row">
          <div class="col-md-6">
            <!-- Display product image with fallback -->
            <img :src="product.mainImage || '/path/to/default/image.jpg'" class="img-fluid" alt="Product Image" />
          </div>
          <div class="col-md-6">
            <h2>{{ product.prodName }}</h2>
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p class="text-capitalize">
              <strong>Categories: </strong>
              <span v-for="(category, index) in product.category" :key="index">
                {{ category.catName }}<span v-if="index < product.category.length - 1">, </span>
              </span>
            </p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
            <p><strong>Description:</strong> {{ product.description }}</p>

            <!-- Additional specifications -->
            <div class="mt-3">
              <p><strong>Processor:</strong> {{ product.processor }}</p>
              <p><strong>RAM:</strong> {{ product.ram }}</p>
              <p><strong>Storage:</strong> {{ product.storage }}</p>
            </div>

            <div class="mt-4">
              <!-- Add to Cart button -->
              <AddToCart :product="product" />
            </div>
          </div>
        </div>

        <!-- Related Products Section -->
        <h3 class="mt-5 mb-4 text-center">Related Products</h3>
        <div class="border-bottom mb-5"></div>

        <div class="product-slider">
          <button @click="moveSlider('left')" class="slider-btn left-btn">&lt;</button>
          <div class="product-container">
            <div v-for="(relatedProduct, index) in relatedProducts.slice(currentIndex, currentIndex + itemsPerPage)" :key="index" class="product-item">
              <div class="card p-3 h-100 shadow-sm border-0">
                <div class="card-img">
                  <!-- Display related product image with fallback -->
                  <img :src="relatedProduct.mainImage || '/path/to/default/image.jpg'" class="img" alt="Related Product Image" />
                </div>
                <div class="card-body">
                  <h5 class="card-title">
                    <router-link :to="'/product/' + relatedProduct.prodID">{{ relatedProduct.prodName }}</router-link>
                  </h5>
                  <p class="card-text">
                    <strong>Price: ${{ relatedProduct.price }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button @click="moveSlider('right')" class="slider-btn right-btn">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddToCart from '@/components/Cart/AddToCart.vue'

export default {
  data() {
    return {
      product: null,
      relatedProducts: [],
      currentIndex: 0, // Track the current index for the slider
      itemsPerPage: 4, // Number of items to display at once
    }
  },
  components: {
    AddToCart,
  },
  watch: {
    '$route.params.id': 'fetchData',
  },
  methods: {
    async fetchData() {
      const productId = this.$route.params.id;

      try {
        // Fetch product details
        let productResponse = await fetch(`http://localhost:3000/product/detail/${productId}`);

        if (productResponse.ok) {
          let result = await productResponse.json();
          if (result.status === "success" && result.data.length > 0) {
            this.product = result.data[0];
            console.log("Product ID:", this.product.prodID);  // Log the product ID
            console.log("Category ID:", this.product.category[0].catID);  // Log the category ID
            console.log("Category Name:", this.product.category[0].catName);  // Log the category name
            console.log("Product Main Image:", this.product.mainImage);  // Log the product main image
          } else {
            console.error('Error in product response structure:', result);
          }
        } else {
          console.error('Error fetching product details:', productResponse.status);
        }

        // Fetch related products
        const relatedProductsUrl = `http://localhost:3000/product/related/${productId}?limit=10`;
        let productsResponse = await fetch(relatedProductsUrl);

        if (productsResponse.ok) {
          let result = await productsResponse.json();
          if (result.status === "success" && result.data) {
            this.relatedProducts = result.data; // Get all related products
            console.log("Related Products:", this.relatedProducts);
          } else {
            console.error('Error in related products response structure:', result);
          }
        } else {
          console.error('Error fetching related products:', productsResponse.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    // Method to handle left and right slider movement
    moveSlider(direction) {
      if (direction === 'left' && this.currentIndex > 0) {
        this.currentIndex -= this.itemsPerPage;
      } else if (direction === 'right' && this.currentIndex < this.relatedProducts.length - this.itemsPerPage) {
        this.currentIndex += this.itemsPerPage;
      }
    },
  },

  async created() {
    await this.fetchData();
  },
}
</script>

<style scoped>
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

.img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.img-fluid {
  width: 100%;
  height: 400px;
  object-fit: contain;
}

.star-rating {
  font-size: 15px;
  color: #ffd700;
}

.product-slider {
  display: flex;
  align-items: center;
  position: relative;
}

.product-container {
  display: flex;
  overflow-x: hidden;
  width: 100%;
}

.product-item {
  flex: 0 0 auto;
  width: 25%; /* 4 products per page */
  padding: 0 10px;
}

.slider-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.left-btn {
  left: 0;
}

.right-btn {
  right: 0;
}
</style>
