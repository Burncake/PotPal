<template>
    <div class="container mt-5">
      <h2 class="mb-4">My Orders</h2>
      <div v-if="loading" class="text-center">
        <p>Loading orders...</p>
      </div>
      <div v-if="error" class="alert alert-danger">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-if="orders.length > 0">
        <div
          v-for="order in orders"
          :key="order.orderID"
          class="card mb-3 shadow-sm"
        >
          <div class="card-body">
            <h5 class="card-title">Order ID: {{ order.orderID }}</h5>
            <div class="d-flex justify-content-between align-items-center">
              <p><strong>Status:</strong> {{ order.orderStatus }}</p>
              <div class="status-image">
                <img v-if="order.orderStatus === 'Canceled'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROM00hI5cx6U1J8cDbk_LaCh3V7JvB32Okkg&s" alt="Canceled" class="status-icon" />
                <img v-if="order.orderStatus === 'Processing'" src="https://i.imgflip.com/4rkzip.jpg" alt="Processing" class="status-icon" />
                <img v-if="order.orderStatus === 'Shipping'" src="https://i.pinimg.com/474x/b6/4d/fc/b64dfcfdb6e0c65dc24104121116d387.jpg" alt="Shipping" class="status-icon" />
                <img v-if="order.orderStatus === 'Delivered'" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/11/pizza-time-1.jpg" alt="Delivered" class="status-icon" />
              </div>
            </div>
            <p><strong>Order Date:</strong> {{ formatDate(order.orderDate) }}</p>
            <p><strong>Total Cost:</strong> ${{ order.totalCost }}</p>
            <p><strong>Address:</strong> {{ order.address }}</p>
            <p><strong>Note:</strong> {{ order.note }}</p>
            <p><strong>Payment Method:</strong> {{ order.payMethod }}</p>
            <p><strong>Order Details:</strong></p>
            <button
              class="btn btn-primary mt-3"
              @click="viewOrderDetail(order.orderID)"
            >
              View Order Detail
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && !error" class="text-center">
        <p>No orders found for this customer.</p>
      </div>
    </div>
</template>

<script>
import { UserStore } from '@/store/User';
  
export default {
  data() {
    return {
      orders: [],
      loading: false,
      error: false,
      errorMessage: "",
      userID: UserStore().user.userID,
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      this.loading = true;
      fetch("https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders")
        .then((response) => response.json())
        .then((data) => {
          // Filter orders based on userID
          this.orders = data.filter((order) => order.userID === this.userID);
          // Sort orders by orderID in descending order
          this.orders.sort((a, b) => b.orderID.localeCompare(a.orderID));
          this.loading = false;
        })
        .catch((error) => {
          this.error = true;
          this.errorMessage = "Failed to fetch orders.";
          this.loading = false;
        });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    viewOrderDetail(orderID) {
      this.$router.push(`/order/${orderID}`);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.card {
  border-radius: 8px;
}

.card-title {
  font-weight: bold;
}

.status-image {
  display: flex;
  align-items: center;
}

.status-icon {
  width: 200px; /* Adjust the size to fit your design */
  height: 200px;
  margin-left: 10px;
  border-radius: 50%; /* Makes the icons rounded */
  background-color: #f0f0f0; /* Optional: adds a background color behind the icons */
  padding: 10px; /* Optional: add some padding to make the icon look better */
}

.btn {
  width: auto;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mt-3 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}
</style>
