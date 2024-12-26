<template>
  <div class="cart-view">
    <h1 class="cart-title">{{ customerName }}'s Cart</h1>
    
    <div v-if="cartDetails.length > 0" class="cart-list">
      <div v-for="(cart, index) in cartDetails" :key="cart.cartID" class="cart">
        <div class="cart-header">
          <h2 class="cart-id">Cart: {{ cart.cartID }}</h2>
        </div>
        
        <div class="cart-items">
          <div v-for="(item, idx) in cart.cartsDetail" :key="idx" class="cart-item">
            <div class="product-image-container">
              <img :src="getProductImage(item.prodID)" alt="Product Image" class="product-image" />
            </div>
            
            <div class="product-info">
              <h3 class="product-name">{{ getProductName(item.prodID) }}</h3>
              <p class="product-description">{{ getProductDescription(item.prodID) }}</p>
              
              <div class="product-details">
                <p><strong>Price:</strong> {{ getProductPrice(item.prodID) | currency }}</p>
                
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(cart.cartID, item.prodID)" :disabled="item.quantity <= 1">-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(cart.cartID, item.prodID)" :disabled="item.quantity >= getProductStock(item.prodID)">+</button>
                </div>
                
                <p><strong>Total:</strong> {{ getProductPrice(item.prodID) * item.quantity | currency }}</p>
                
                <button @click="removeProductFromCart(cart.cartID, item.prodID)" class="remove-product-button">
                  <i class="fa fa-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <hr />
      </div>
      
      <div class="cart-summary">
        <h3>Total: {{ calculateTotalAmount(cartDetails) | currency }}</h3>
      </div>
    </div>
    
    <div v-else>
      <p class="empty-cart">The cart is empty.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customerID: '00001', // Example, you can change this value or receive it from props or route params.
      customerName: '', // To store the fullName of the customer
      cartData: [], // Cart data from API
      productData: [], // Product data from API
      userData: [], // User data from API
    };
  },
  computed: {
    cartDetails() {
      return this.cartData.filter(cart => cart.customerID === this.customerID);
    }
  },
  methods: {
    async fetchCartData() {
      const cartResponse = await fetch('https://67628fc046efb373237507fb.mockapi.io/carts');
      this.cartData = await cartResponse.json();
    },
    async fetchProductData() {
      const productResponse = await fetch('https://6754193836bcd1eec85023b2.mockapi.io/api/products');
      this.productData = await productResponse.json();
    },
    async fetchUserData() {
      const userResponse = await fetch('https://67628fc046efb373237507fb.mockapi.io/user');
      this.userData = await userResponse.json();
      const user = this.userData.find(user => user.userID === this.customerID);
      this.customerName = user ? user.fullName : 'Unknown Customer'; // Set the customerName
    },
    getProductName(prodID) {
      const product = this.productData.find(product => product.prodID === prodID);
      return product ? product.prodName : 'Product name not found';
    },
    getProductDescription(prodID) {
      const product = this.productData.find(product => product.prodID === prodID);
      return product ? product.description : 'No description available';
    },
    getProductPrice(prodID) {
      const product = this.productData.find(product => product.prodID === prodID);
      return product ? product.price : 0;
    },
    getProductImage(prodID) {
      const product = this.productData.find(product => product.prodID === prodID);
      return product ? product.mainImage : '';
    },
    getProductStock(prodID) {
      const product = this.productData.find(product => product.prodID === prodID);
      return product ? product.stock : 0;
    },
    calculateTotalAmount(cartDetails) {
      return cartDetails.reduce((total, cart) => {
        return total + cart.cartsDetail.reduce((cartTotal, item) => {
          return cartTotal + (this.getProductPrice(item.prodID) * item.quantity);
        }, 0);
      }, 0);
    },
    async updateCart(cartID, prodID, quantity) {
      const cart = this.cartData.find(cart => cart.cartID === cartID);
      const cartItem = cart.cartsDetail.find(item => item.prodID === prodID);
      if (cartItem) {
        cartItem.quantity = quantity;
      }
      await fetch(`https://67628fc046efb373237507fb.mockapi.io/carts/${cartID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
    },
    increaseQuantity(cartID, prodID) {
      const cart = this.cartData.find(cart => cart.cartID === cartID);
      const cartItem = cart.cartsDetail.find(item => item.prodID === prodID);
      if (cartItem && cartItem.quantity < this.getProductStock(prodID)) {
        cartItem.quantity++;
        this.updateCart(cartID, prodID, cartItem.quantity);
      }
    },
    decreaseQuantity(cartID, prodID) {
      const cart = this.cartData.find(cart => cart.cartID === cartID);
      const cartItem = cart.cartsDetail.find(item => item.prodID === prodID);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        this.updateCart(cartID, prodID, cartItem.quantity);
      }
    },
    async removeProductFromCart(cartID, prodID) {
      const cart = this.cartData.find(cart => cart.cartID === cartID);
      const cartItemIndex = cart.cartsDetail.findIndex(item => item.prodID === prodID);
      if (cartItemIndex !== -1) {
        cart.cartsDetail.splice(cartItemIndex, 1); // Remove the product from cart
        await fetch(`https://67628fc046efb373237507fb.mockapi.io/carts/${cartID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cart),
        });
      }
    },
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  },
  mounted() {
    this.fetchCartData();
    this.fetchProductData();
    this.fetchUserData(); // Fetch user data when the component is mounted
  }
};
</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.cart-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.cart-header {
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.cart-id {
  font-size: 1.5rem;
  color: #333;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.product-image-container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.product-info {
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.product-description {
  font-size: 1rem;
  color: #777;
}

.product-details {
  margin-top: 15px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.quantity {
  font-size: 1.1rem;
  font-weight: bold;
}

.remove-product-button {
  margin-top: 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.remove-product-button i {
  margin-right: 8px;
}

.remove-product-button:hover {
  background-color: #c0392b;
}

.cart-summary {
  text-align: right;
  font-size: 1.25rem;
  font-weight: bold;
}

.empty-cart {
  text-align: center;
  font-size: 1.25rem;
  color: #888;
}
</style>
