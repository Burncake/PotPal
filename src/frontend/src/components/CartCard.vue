<template>
    <div v-if="cartItems.length" class="cart-card">
      <div v-for="(item, index) in cartItems" :key="item.prodID" class="cart-item">
        <div class="cart-item-image">
          <img :src="item.mainImage" :alt="item.prodName" />
        </div>
        <div class="cart-item-details">
          <h3>{{ item.prodName }}</h3>
          <p>Price: ${{ item.cost.toFixed(2) }}</p>
          <div class="cart-item-quantity">
            <button @click="removeFromCart(item.prodID)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="addToCart(item.prodID)">+</button>
          </div>
        </div>
        <div class="cart-item-total">
          <p>Total: ${{ item.cost.toFixed(2) }}</p>
        </div>
      </div>
      <div class="cart-summary">
        <h2>Total Items: {{ totalItems }}</h2>
        <h3>Total Price: ${{ totalPrice.toFixed(2) }}</h3>
        <button @click="clearCart" class="clear-cart-btn">Clear Cart</button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty!</p>
    </div>
  </template>
  
  <script>
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/products'

export default {
  name: 'CartCard',

  computed: {
    cartStore() {
      return useCartStore()
    },
    productStore() {
      return useProductStore()
    },
    cartItems() {
      return this.cartStore.formattedCart.map(item => {
        const product = this.productStore.items[item.prodID]
        return {
          ...item,
          mainImage: item.mainImage || product?.mainImage,  // Use API's mainImage
          prodName: item.prodName || product?.prodName,    // Use API's prodName
          cost: item.quantity * (parseFloat(product?.price) || 0),  // Convert price to number and calculate cost
        }
      })
    },
    totalItems() {
      return this.cartStore.count
    },
    totalPrice() {
      return this.cartStore.total
    },
  },

  methods: {
    addToCart(prodID) {
      this.cartStore.add(prodID)
    },
    removeFromCart(prodID) {
      this.cartStore.remove(prodID)
    },
    clearCart() {
      this.cartStore.clearCart()
    },
  },
}
</script>
  
  <style scoped>
  .cart-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .cart-item-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .cart-item-details {
    margin-left: 20px;
    flex: 1;
  }
  
  .cart-item-quantity {
    display: flex;
    align-items: center;
  }
  
  .cart-item-quantity button {
    padding: 5px 10px;
    margin: 0 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .cart-item-quantity button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  .cart-item-total {
    text-align: right;
  }
  
  .cart-summary {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .clear-cart-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  
  .clear-cart-btn:hover {
    background-color: #c82333;
  }
  </style>