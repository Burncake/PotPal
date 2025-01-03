<template>
  <div class="cart-view">
    <div class="cart-header">
      <h1 class="cart-title">My Cart</h1>
    </div>

    <div v-if="hasItems" class="cart-content">
      <div class="cart-items">
        <div v-for="cart in cartDetails" :key="cart.cartID">
          <div v-if="cart.cartsDetail.length === 0" class="empty-state">
            <i class="fa fa-shopping-cart"></i>
            <p>This cart is empty</p>
          </div>
          <template v-else>
            <div v-for="item in cart.cartsDetail" :key="item.prodID" class="cart-item">
              <div class="product-image-container">
                <img
                  :src="getProductImage(item.prodID)"
                  :alt="getProductName(item.prodID)"
                  class="product-image"
                />
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ getProductName(item.prodID) }}</h3>
                <p class="product-description">{{ getProductDescription(item.prodID) }}</p>

                <div class="product-details">
                  <div class="price-quantity">
                    <p class="price">{{ getProductPrice(item.prodID) | currency }}</p>

                    <div class="quantity-controls">
                      <button
                        @click="decreaseQuantity(cart.cartID, item.prodID)"
                        :disabled="item.quantity <= 1"
                        class="quantity-btn"
                      >
                        −
                      </button>
                      <span class="quantity">{{ item.quantity }}</span>
                      <button
                        @click="increaseQuantity(cart.cartID, item.prodID)"
                        :disabled="item.quantity >= getProductStock(item.prodID)"
                        class="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div class="actions">
                    <p class="total">
                      Total: {{ (getProductPrice(item.prodID) * item.quantity) | currency }}
                    </p>
                    <button
                      @click="removeProductFromCart(cart.cartID, item.prodID)"
                      class="remove-button"
                    >
                      <i class="fa fa-trash"></i>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-content">
          <h2>Order Summary</h2>
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ calculateTotalAmount(cartDetails) | currency }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>{{ calculateTotalAmount(cartDetails) | currency }}</span>
            </div>
          </div>
          <button
            v-if="cartDetails.some((cart) => cart.cartsDetail.length > 0)"
            @click="goToPaymentPage"
            class="checkout-button"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="fa fa-shopping-cart"></i>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <router-link to="/" class="continue-shopping">Continue Shopping</router-link>
    </div>
  </div>
</template>

<script>
import { UserStore } from '@/store/User'

export default {
  data() {
    return {
      customerID: UserStore().user.userID,
      customerName: '',
      cartData: [],
      productData: [],
      userData: [],
    }
  },
  computed: {
    cartDetails() {
      return this.cartData.filter((cart) => cart.customerID === this.customerID)
    },
    hasItems() {
      return this.cartDetails.some((cart) => cart.cartsDetail && cart.cartsDetail.length > 0)
    },
  },
  methods: {
    async fetchCartData() {
      const cartResponse = await fetch(
        'http://127.0.0.1:3000/checkout/cart/customer/' + this.customerID,
      )
      this.cartData = await cartResponse.json()
    },
    async fetchProductData() {
      const productResponse = await fetch('http://127.0.0.1:3000/product/general/all')
      this.productData = await productResponse.json()
    },
    // async fetchUserData() {
    //   const userResponse = await fetch('http://127.0.0.1:3000/user')
    //   this.userData = await userResponse.json()
    //   const user = this.userData.find((user) => user.userID === this.customerID)
    //   this.customerName = user ? user.fullName : 'Unknown Customer'
    // },
    getProductName(prodID) {
      const product = this.productData.find((product) => product.prodID === prodID)
      return product ? product.prodName : 'Product name not found'
    },
    getProductDescription(prodID) {
      const product = this.productData.find((product) => product.prodID === prodID)
      return product ? product.description : 'No description available'
    },
    getProductPrice(prodID) {
      const product = this.productData.find((product) => product.prodID === prodID)
      return product ? product.price : 0
    },
    getProductImage(prodID) {
      const product = this.productData.find((product) => product.prodID === prodID)
      return product ? product.mainImage : ''
    },
    getProductStock(prodID) {
      const product = this.productData.find((product) => product.prodID === prodID)
      return product ? product.stock : 0
    },
    calculateTotalAmount(cartDetails) {
      return cartDetails.reduce((total, cart) => {
        return (
          total +
          cart.cartsDetail.reduce((cartTotal, item) => {
            return cartTotal + this.getProductPrice(item.prodID) * item.quantity
          }, 0)
        )
      }, 0)
    },
    async updateCart(cartID, prodID, quantity) {
      const cart = this.cartData.find((cart) => cart.cartID === cartID)
      const cartItem = cart.cartsDetail.find((item) => item.prodID === prodID)
      if (cartItem) {
        cartItem.quantity = quantity
      }
      await fetch(`http://127.0.0.1:3000/carts/${cartID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      })
    },
    increaseQuantity(cartID, prodID) {
      const cart = this.cartData.find((cart) => cart.cartID === cartID)
      const cartItem = cart.cartsDetail.find((item) => item.prodID === prodID)
      if (cartItem && cartItem.quantity < this.getProductStock(prodID)) {
        cartItem.quantity++
        this.updateCart(cartID, prodID, cartItem.quantity)
      }
    },
    decreaseQuantity(cartID, prodID) {
      const cart = this.cartData.find((cart) => cart.cartID === cartID)
      const cartItem = cart.cartsDetail.find((item) => item.prodID === prodID)
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--
        this.updateCart(cartID, prodID, cartItem.quantity)
      }
    },
    async removeProductFromCart(cartID, prodID) {
      const cart = this.cartData.find((cart) => cart.cartID === cartID)
      const cartItemIndex = cart.cartsDetail.findIndex((item) => item.prodID === prodID)
      if (cartItemIndex !== -1) {
        cart.cartsDetail.splice(cartItemIndex, 1)
        await fetch(`http://127.0.0.1:3000/carts/${cartID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cart),
        })
      }
    },
    goToPaymentPage() {
      const totalCost = this.calculateTotalAmount(this.cartDetails)
      this.$router.push({
        name: 'payment',
        query: {
          username: this.customerName,
          totalCost: totalCost,
        },
      })
    },
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
  },
  mounted() {
    this.fetchCartData()
    this.fetchProductData()
    this.fetchUserData()
  },
}
</script>

<style scoped>
.cart-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f8fafc;
}

.cart-header {
  margin-bottom: 2rem;
  text-align: center;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.product-image-container {
  width: 180px;
  height: 180px;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.product-details {
  margin-top: auto;
}

.price-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2563eb;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background: white;
  color: #1a1a1a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn:not(:disabled):hover {
  background: #2563eb;
  color: white;
}

.quantity {
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.remove-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background: #fecaca;
}

.remove-button i {
  font-size: 0.875rem;
}

.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-content {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.25rem;
  color: #1a1a1a;
  padding-top: 1rem;
  border-top: 2px solid #f3f4f6;
}

.checkout-button {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-button:hover {
  background: #1d4ed8;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-state i {
  font-size: 4rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
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

.continue-shopping {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.continue-shopping:hover {
  background: #1d4ed8;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-view {
    padding: 1rem;
  }

  .cart-title {
    font-size: 2rem;
  }

  .cart-item {
    flex-direction: column;
  }

  .product-image-container {
    width: 100%;
    height: 240px;
  }
}
</style>
