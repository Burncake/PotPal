<template>
    <div v-if="isLoading" class="cart-card-skeleton">
      <div class="cart-item-skeleton" v-for="n in 3" :key="n">
        <div class="cart-item-image skeleton"></div>
        <div class="cart-item-details">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
        <div class="cart-item-total">
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
      <div class="cart-summary-skeleton">
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty!</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CartCardSkeleton',
    data() {
      return {
        isLoading: true,
      }
    },
    mounted() {
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    },
  }
  </script>
  
  <style scoped>
  .cart-card-skeleton {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
  
  .cart-item-skeleton {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .cart-item-image.skeleton {
    width: 100px;
    height: 100px;
    background-color: #ddd;
    border-radius: 4px;
  }
  
  .cart-item-details {
    margin-left: 20px;
    flex: 1;
  }
  
  .skeleton {
    background-color: #ddd;
    border-radius: 4px;
  }
  
  .skeleton-text {
    height: 20px;
    margin: 8px 0;
    width: 80%;
  }
  
  .skeleton-text.short {
    width: 60%;
  }
  
  .skeleton-button {
    height: 36px;
    width: 120px;
  }
  
  .cart-item-total {
    text-align: right;
  }
  
  .cart-summary-skeleton {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .cart-summary-skeleton .skeleton-text.short {
    width: 50%;
  }
  </style>