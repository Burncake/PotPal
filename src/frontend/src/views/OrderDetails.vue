<template>
    <div class="container mt-5">
      <h2 class="mb-4">Order Detail</h2>
  
      <div v-if="loading" class="text-center">
        <p>Loading order details...</p>
      </div>
      <div v-if="error" class="alert alert-danger">
        <p>{{ errorMessage }}</p>
      </div>
  
      <div v-if="order && products" class="order-detail-card">
        <!-- Order information -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title text-primary">Order ID: {{ order.orderID }}</h5>
            <div class="d-flex justify-content-between align-items-center">
              <p class="mb-0"><strong>Status:</strong> {{ order.orderStatus }}</p>
              <div class="status-image">
                <!-- Status images based on order status -->
                <img v-if="order.orderStatus === 'Canceled'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROM00hI5cx6U1J8cDbk_LaCh3V7JvB32Okkg&s" alt="Canceled" class="status-icon" />
                <img v-if="order.orderStatus === 'Processing'" src="https://i.imgflip.com/4rkzip.jpg" alt="Processing" class="status-icon" />
                <img v-if="order.orderStatus === 'Shipping'" src="https://i.pinimg.com/474x/b6/4d/fc/b64dfcfdb6e0c65dc24104121116d387.jpg" alt="Shipping" class="status-icon" />
                <img v-if="order.orderStatus === 'Delivered'" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/11/pizza-time-1.jpg" alt="Delivered" class="status-icon" />
              </div>
            </div>
            <div class="order-info">
              <p><strong>Order Date:</strong> {{ formatDate(order.orderDate) }}</p>
              <p><strong>Total Cost:</strong> ${{ order.totalCost }}</p>
              <p><strong>Address:</strong> {{ order.address }}</p>
              <p><strong>Note:</strong> {{ order.note }}</p>
              <p><strong>Payment Method:</strong> {{ order.payMethod }}</p>
            </div>
          </div>
        </div>
  
        <!-- Product details -->
        <h4 class="mb-3">Products in Order</h4>
        <div v-for="item in enrichedOrderDetails" :key="item.prodID" class="card mb-3 shadow-sm product-card">
          <div class="row g-0">
            <div class="col-md-4">
              <img :src="item.mainImage" class="img-fluid rounded-start product-image" alt="Product Image" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ item.prodName }}</h5>
                <p><strong>Price:</strong> ${{ item.price }}</p>
                <p><strong>Quantity:</strong> {{ item.quantity }}</p>
                <p><strong>Total:</strong> ${{ item.price * item.quantity }}</p>
                <p><strong>Description:</strong> {{ item.description }}</p>
                <div class="product-specs">
                  <p><strong>Processor:</strong> {{ item.processor }}</p>
                  <p><strong>RAM:</strong> {{ item.ram }}</p>
                  <p><strong>Storage:</strong> {{ item.storage }}</p>
                </div>
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
      order: null,
      products: [],
      enrichedOrderDetails: [],
      loading: false,
      error: false,
      errorMessage: "",
    };
  },
  mounted() {
    this.fetchOrderDetail();
  },
  methods: {
    async fetchOrderDetail() {
      this.loading = true;
      const orderID = this.$route.params.orderID;
      try {
        const [orderResponse, productResponse] = await Promise.all([
          fetch(`https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders/${orderID}`).then((res) => res.json()),
          fetch("https://6754193836bcd1eec85023b2.mockapi.io/api/products").then((res) => res.json()),
        ]);

        this.order = orderResponse;
        this.products = productResponse;

        // Enrich order details with product information
        this.enrichedOrderDetails = this.order.orderDetails.map((item) => {
          const product = this.products.find((prod) => prod.prodID === item.prodID);
          return {
            ...item,
            ...product,
          };
        });

        this.loading = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = "Failed to fetch order details.";
        this.loading = false;
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
};
</script>

  
  <style scoped>
  .container {
    max-width: 900px;
    margin: auto;
  }
  
  .card {
    border-radius: 12px;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .order-detail-card .card-body {
    padding: 1.5rem;
  }
  
  .order-info p {
    margin-bottom: 0.8rem;
  }
  
  .status-image {
    display: flex;
    align-items: center;
  }
  
  .status-icon {
  max-width: 300px; /* Increased size */
  height: auto;
  margin-left: 10px;
}
  
  .product-card {
    border-radius: 10px;
  }
  
  .product-image {
    object-fit: cover;
    max-height: 200px;
  }
  
  .product-specs p {
    margin-bottom: 0.5rem;
  }
  
  .product-card .card-body {
    padding: 1rem;
  }
  
  .text-primary {
    color: #007bff;
  }
  
  .mb-3 {
    margin-bottom: 1rem;
  }
  
  .mb-4 {
    margin-bottom: 2rem;
  }
  
  h4 {
    font-size: 1.3rem;
    font-weight: 500;
  }
  
  .order-info p {
    font-size: 1rem;
    color: #555;
  }
  </style>
  Ảnh status icon xấu quá chỉnh lại cho đẹp