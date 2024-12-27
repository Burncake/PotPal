<template>

    <div class="container mt-5">
      <h2 class="mb-4">Admin Orders</h2>
      <div v-if="loading" class="text-center">
        <p>Loading orders...</p>
      </div>
      <div v-if="error" class="alert alert-danger">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-if="orders.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">User ID</th>
              <th scope="col">Status</th>
              <th scope="col">Total Cost</th>
              <th scope="col">Created At</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.orderID">
              <td>{{ order.orderID }}</td>
              <td>{{ order.userID }}</td>
              <td>{{ order.orderStatus }}</td>
              <td>${{ order.totalCost }}</td>
              <td>{{ formatDate(order.createAt) }}</td>
              <td>
                <button class="btn btn-info" @click="viewOrderDetails(order)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!loading && !error" class="text-center">
        <p>No orders found.</p>
      </div>
  
      <!-- Modal for displaying order details -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Order Details</h2>
          <h4>User Information</h4>
          <p><strong>User ID:</strong> {{ selectedOrder.userID }}</p>
          <p><strong>Full Name:</strong> {{ userInfo.fullName }}</p>
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
          <p><strong>Address:</strong> {{ userInfo.address }}</p>
          <p><strong>Phone Number:</strong> {{ userInfo.phoneNumber }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orders: [],
        loading: false,
        error: false,
        errorMessage: "",
        showModal: false,
        selectedOrder: null,
        userInfo: {},
        productInfo: [],
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
            this.orders = data; // Directly assign all orders to the orders array
            this.loading = false;
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Failed to fetch orders.";
            this.loading = false;
          });
      },
      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(date).toLocaleString(undefined, options);
      },
      viewOrderDetails(order) {
        this.selectedOrder = order;
        this.fetchUserInfo(order.userID);
        this.fetchProductInfo(order.orderID);
        this.showModal = true;
      },
      fetchUserInfo(userID) {
        fetch(`https://67628fc046efb373237507fb.mockapi.io/user`)
          .then((response) => response.json())
          .then((users) => {
            this.userInfo = users.find(user => user.userID === userID) || {};
          });
      },
      fetchProductInfo(orderID) {
        // You may need to implement logic to fetch products based on the orderID
        // Assuming you can fetch products by orderId or have a relationship stored in the order
        fetch(`https://6754193836bcd1eec85023b2.mockapi.io/api/products`) // Replace with the appropriate endpoint based on your data structure
          .then((response) => response.json())
          .then((products) => {
            // Filter or map to get products related to this orderID if needed
            this.productInfo = products.filter(product => product.orderId === orderID);
          });
      },
      closeModal() {
        this.showModal = false;
        this.selectedOrder = null;
        this.userInfo = {};
        this.productInfo = [];
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  
  .table {
    margin-top: 20px;
  }
  
  .table th,
  .table td {
    text-align: center;
  }
  
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>