<template>
  <div class="order-detail-view">
    <div class="order-detail-header">
      <h1>Order Details</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading order details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="order" class="order-detail-content">
      <div class="order-info">
        <div class="order-header">
          <h2>Order #{{ order.orderID }}</h2>
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

        <div class="order-summary">
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
      </div>

      <div class="products-section">
        <h2>Products</h2>
        <div class="products-list">
          <div v-for="product in enrichedOrderDetails" :key="product.prodID" class="product-card">
            <div class="product-image">
              <img :src="product.mainImage" :alt="product.prodName">
            </div>
            <div class="product-details">
              <h3 class="product-name">{{ product.prodName }}</h3>
              <p class="product-description">{{ product.description }}</p>
              
              <div class="specs">
                <div class="spec-group">
                  <div class="spec-item">
                    <span class="spec-label">Price:</span>
                    <span class="spec-value price">${{ product.price }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Quantity:</span>
                    <span class="spec-value">{{ product.quantity }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Total:</span>
                    <span class="spec-value total">${{ product.price * product.quantity }}</span>
                  </div>
                </div>
                
                <div class="tech-specs">
                  <div class="spec-item">
                    <span class="spec-label">Processor:</span>
                    <span class="spec-value">{{ product.processor }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">RAM:</span>
                    <span class="spec-value">{{ product.ram }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Storage:</span>
                    <span class="spec-value">{{ product.storage }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <h2>Order Not Found</h2>
      <p>We couldn't find the order you're looking for.</p>
      <router-link to="/orders" class="back-btn">Back to Orders</router-link>
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
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async fetchOrderDetail() {
      this.loading = true;
      const orderID = this.$route.params.orderID;
      
      try {
        const [orderResponse, productResponse] = await Promise.all([
          fetch(`https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders/${orderID}`),
          fetch("https://6754193836bcd1eec85023b2.mockapi.io/api/products")
        ]);

        const [orderData, productData] = await Promise.all([
          orderResponse.json(),
          productResponse.json()
        ]);

        this.order = orderData;
        this.products = productData;
        this.enrichedOrderDetails = this.order.orderDetails.map(item => ({
          ...item,
          ...this.products.find(prod => prod.prodID === item.prodID)
        }));
      } catch (error) {
        this.error = true;
        this.errorMessage = "Failed to fetch order details.";
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchOrderDetail();
  }
};
</script>

<style scoped>
.order-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.order-detail-header {
  margin-bottom: 2rem;
  text-align: center;
}

.order-detail-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.order-info {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.order-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
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

.order-summary {
  display: grid;
  gap: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
}

.label {
  font-weight: 500;
  color: #666;
}

.total-cost {
  font-weight: 600;
  color: #2563eb;
}

.products-section {
  margin-top: 2rem;
}

.products-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.specs {
  display: grid;
  gap: 1.5rem;
}

.spec-group {
  display: grid;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tech-specs {
  display: grid;
  gap: 0.5rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  font-weight: 500;
  color: #666;
}

.spec-value {
  font-weight: 500;
}

.spec-value.price {
  color: #2563eb;
}

.spec-value.total {
  color: #059669;
  font-weight: 600;
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

.back-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-btn:hover {
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
  .product-card {
    grid-template-columns: 1fr;
  }
  
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
  width: 120px;
  height: 120px;
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
    width: 100px;
    height: 100px;
  }
}
</style>
