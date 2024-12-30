<template>
  <div class="orders-view">
    <div class="orders-header">
      <h1>My Orders</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading orders...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.orderID" class="order-card">
        <div class="order-header">
          <h2 class="order-id">Order #{{ order.orderID }}</h2>
          <div class="status-container">
            <div class="status-badge" :class="order.orderStatus.toLowerCase()">
              {{ order.orderStatus }}
            </div>
            <div class="status-image">
              <img v-if="order.orderStatus === 'Pending'" src="https://i.ytimg.com/vi/E2lHg63Crag/maxresdefault.jpg" alt="Pending" class="status-icon" />
              <img v-if="order.orderStatus === 'Canceled'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROM00hI5cx6U1J8cDbk_LaCh3V7JvB32Okkg&s" alt="Canceled" class="status-icon" />
              <img v-if="order.orderStatus === 'Processing'" src="https://i.imgflip.com/4rkzip.jpg" alt="Processing" class="status-icon" />
              <img v-if="order.orderStatus === 'Shipping'" src="https://i.pinimg.com/474x/b6/4d/fc/b64dfcfdb6e0c65dc24104121116d387.jpg" alt="Shipping" class="status-icon" />
              <img v-if="order.orderStatus === 'Delivered'" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/11/pizza-time-1.jpg" alt="Delivered" class="status-icon" />
            </div>
          </div>
        </div>
        
        <div class="order-info">
          <div class="info-row">
            <span class="label">Order Date:</span>
            <span>{{ formatDate(order.orderDate) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Total Cost:</span>
            <span class="total-cost">${{ order.totalCost }}</span>
          </div>
          <div class="info-row">
            <span class="label">Address:</span>
            <span>{{ order.address }}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span>{{ order.payMethod }}</span>
          </div>
          <div class="info-row" v-if="order.note">
            <span class="label">Note:</span>
            <span>{{ order.note }}</span>
          </div>
        </div>

        <button class="view-details-btn" @click="viewOrderDetail(order.orderID)">
          View Details
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <h2>No Orders Yet</h2>
      <p>Looks like you haven't placed any orders yet.</p>
      <router-link to="/" class="shop-now-btn">Shop Now</router-link>
    </div>
  </div>
</template>

<script>
import { UserStore } from '@/store/User'

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
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await fetch("https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders");
        const data = await response.json();
        this.orders = data
          .filter(order => order.userID === this.userID)
          .sort((a, b) => b.orderID.localeCompare(a.orderID));
      } catch (error) {
        this.error = true;
        this.errorMessage = "Failed to fetch orders.";
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    viewOrderDetail(orderID) {
      this.$router.push(`/order/${orderID}`);
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.orders-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.orders-header {
  margin-bottom: 2rem;
  text-align: center;
}

.orders-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.order-id {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
}

.status-badge.pending {
  background-color: #fde68a;
  color: #9a6b00;
}

.status-badge.processing {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.shipping {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.delivered {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.canceled {
  background-color: #fee2e2;
  color: #991b1b;
}

.order-info {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
  align-items: baseline;
}

.label {
  font-weight: 500;
  color: #666;
}

.total-cost {
  font-weight: 600;
  color: #2563eb;
}

.view-details-btn {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background: #1d4ed8;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.shop-now-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.shop-now-btn:hover {
  background: #1d4ed8;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #dc2626;
}

@media (max-width: 640px) {
  .info-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  
  .label {
    color: #666;
  }
}

.status-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-image {
  display: flex;
  align-items: center;
}

.status-icon {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .status-container {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .status-icon {
    width: 80px;
    height: 80px;
  }
}
</style>
