<template>
    <div class="payment-view">
      <h1>Payment Details</h1>
  
      <!-- User Information Section -->
      <div class="section user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {{ customerName }}</p>
        <p><strong>Address:</strong> {{ customerAddress }}</p>
        <p><strong>Phone Number:</strong> {{ customerPhoneNumber }}</p>
      </div>
  
      <!-- Payment Form -->
      <div class="section payment-form">
        <h3>Payment Information</h3>
  
        <!-- Address Input -->
        <div class="input-group">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="address" :placeholder="customerAddress" />
        </div>
  
        <!-- Phone Number Input -->
        <div class="input-group">
          <label for="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" :placeholder="customerPhoneNumber" />
        </div>
  
        <!-- Payment Method Selection -->
        <div class="input-group">
          <label for="payMethod">Payment Method:</label>
          <select v-model="payMethod" id="payMethod">
            <option value="PayPal">PayPal</option>
            <option value="Momo">Momo</option>
            <option value="Visa">Visa</option>
            <option value="ZaloPay">ZaloPay</option>
          </select>
        </div>
  
        <!-- Note Section -->
        <div class="input-group">
          <label for="note">Note (optional):</label>
          <textarea id="note" v-model="note" placeholder="Add any additional notes here..."></textarea>
        </div>
  
        <!-- Apply Voucher Button -->
        <div class="input-group">
          <button @click="toggleVoucherList" class="apply-voucher-button">Apply Voucher</button>
        </div>
      </div>
  
      <!-- Total Cost -->
      <div class="total-cost">
        <h3>Total: {{ totalCost | currency }}</h3>
      </div>
  
      <!-- Checkout Button -->
      <div class="checkout-button-container">
        <button @click="completeOrder" class="checkout-button">Complete Order</button>
      </div>
  
      <!-- Voucher Modal -->
      <div v-if="showVoucherList" class="voucher-modal">
        <div class="voucher-modal-content">
          <h4>Available Vouchers</h4>
          <ul>
            <li v-for="voucher in vouchers" :key="voucher.discountID">
              <p>{{ voucher.discountName }} ({{ voucher.discountType }}): {{ voucher.discountValue }}% off</p>
              <p v-if="voucher.discountID === appliedVoucher.discountID" style="color: green;">Applied</p>
              <button @click="applyVoucher(voucher)" :disabled="voucher.discountID === appliedVoucher.discountID">Apply</button>
            </li>
          </ul>
          <button @click="toggleVoucherList" class="close-modal">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customerID: '00001',
        customerName: '',
        customerAddress: '',
        customerPhoneNumber: '',
        address: '',
        phoneNumber: '',
        payMethod: 'PayPal',
        note: '',
        userData: [],
        cartData: [],
        productData: [],
        lastOrderID: 0,
        totalCost: 0,
        showVoucherList: false,
        vouchers: [],
        appliedVoucher: {}  // Track applied voucher
      };
    },
    methods: {
      async fetchUserData() {
        const userResponse = await fetch('https://67628fc046efb373237507fb.mockapi.io/user');
        this.userData = await userResponse.json();
        const user = this.userData.find(user => user.userID === this.customerID);
        this.customerName = user ? user.fullName : 'Unknown Customer';
        this.customerAddress = user ? user.address : 'Unknown Address';
        this.customerPhoneNumber = user ? user.phoneNumber : 'Unknown Phone Number';
      },
      async fetchCartData() {
        const cartResponse = await fetch('https://67628fc046efb373237507fb.mockapi.io/carts');
        this.cartData = await cartResponse.json();
      },
      async fetchProductData() {
        const productResponse = await fetch('https://6754193836bcd1eec85023b2.mockapi.io/api/products');
        this.productData = await productResponse.json();
      },
      async fetchVouchers() {
        const voucherResponse = await fetch('https://676d499b0e299dd2ddff0c39.mockapi.io/orders/discounts');
        this.vouchers = await voucherResponse.json();
      },
      toggleVoucherList() {
        this.showVoucherList = !this.showVoucherList;
        if (this.showVoucherList) {
          this.fetchVouchers();
        }
      },
      applyVoucher(voucher) {
        // Revert discount if there's an applied voucher
        if (this.appliedVoucher.discountID) {
          this.revertDiscount();
        }
  
        // Apply the new voucher
        if (voucher.discountType === 'Percentage') {
          this.totalCost = this.totalCost - (this.totalCost * (voucher.discountValue / 100));
        } else if (voucher.discountType === 'Flat') {
          this.totalCost = this.totalCost - voucher.discountValue;
        }
  
        this.appliedVoucher = voucher; // Store the applied voucher
        this.showVoucherList = false;
      },
      revertDiscount() {
        // Revert the applied voucher discount
        if (this.appliedVoucher.discountType === 'Percentage') {
          this.totalCost = this.totalCost / (1 - (this.appliedVoucher.discountValue / 100));
        } else if (this.appliedVoucher.discountType === 'Flat') {
          this.totalCost = this.totalCost + this.appliedVoucher.discountValue;
        }
      },
      async completeOrder() {
        const newOrderID = String(this.lastOrderID + 1).padStart(5, '0');

        // Fetch the current cart details for the user
        let currentCartDetails = [];
        try {
            const cartResponse = await fetch(`https://67628fc046efb373237507fb.mockapi.io/carts/${this.customerID}`);
            const cartData = await cartResponse.json();
            currentCartDetails = cartData.cartsDetail || []; // Get the cartsDetail from the fetched cart data
        } catch (error) {
            console.error('Error fetching cart details: ', error);
            alert('Could not fetch cart details for the order.');
            return; // Exit the method if there was an error fetching cart details
        }

        const orderData = {
            orderID: newOrderID,
            userID: this.customerID,
            phoneNumber: this.phoneNumber || this.customerPhoneNumber,
            address: this.address || this.customerAddress,
            orderStatus: "Processing",
            createAt: new Date().toISOString(),
            payMethod: this.payMethod,
            orderDate: new Date().toISOString(),
            totalCost: this.totalCost,
            note: this.note,
            discountID: this.appliedVoucher.discountID || "",  // Store the applied voucher ID
            orderDetails: currentCartDetails 
        };

        try {
            // Send the order data to the orders API
            const orderResponse = await fetch('https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
            });

            if (orderResponse.ok) {
            const order = await orderResponse.json();
            alert(`Order completed! Order ID: ${newOrderID}`);
            
            // After completing the order, update the cart to empty
            await this.updateCart();
            
            // Redirect to the /orders page
            this.$router.push('/orders');
            } else {
            alert('Failed to complete order');
            }
        } catch (error) {
            alert('Error occurred while completing the order: ' + error.message);
        }
            },

  // Method to update the cart to empty the cart details
  async updateCart() {
    const cartData = {
      cartsDetail: [] // Set the cartsDetail to an empty array
    };

    try {
      const cartResponse = await fetch(`https://67628fc046efb373237507fb.mockapi.io/carts/${this.customerID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      });

      if (cartResponse.ok) {
        console.log(`Cart for customer ${this.customerID} updated successfully.`);
      } else {
        console.error('Failed to update cart.');
      }
    } catch (error) {
      console.error('Error occurred while updating the cart: ' + error.message);
    }
  }
    },
  
    mounted() {
      this.fetchUserData();
      this.fetchCartData();
      this.fetchProductData();
      this.totalCost = parseFloat(this.$route.query.totalCost);
  
      fetch('https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders')
        .then(res => res.json())
        .then(orders => {
          const lastOrder = orders[orders.length - 1];
          this.lastOrderID = lastOrder ? parseInt(lastOrder.orderID) : 0;
        });
    }
  };
  </script>
  
  <style scoped>
  .payment-view {
    max-width: 900px;
    margin: 20px auto;
    padding: 25px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 25px;
    color: #333;
  }
  
  .section {
    margin-bottom: 35px;
  }
  
  .section h3 {
    font-size: 1.6rem;
    margin-bottom: 15px;
    color: #2c3e50;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-group label {
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
    color: #555;
  }
  
  .input-group input,
  .input-group select,
  .input-group textarea {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .input-group textarea {
    resize: vertical;
  }
  
  .total-cost {
    font-size: 1.3rem;
    font-weight: bold;
    color: #2c3e50;
    text-align: right;
  }
  
  .checkout-button-container {
    display: flex;
    justify-content: flex-end;
  }
  
  .checkout-button {
    background-color: #3498db;
    color: white;
    padding: 15px 40px;
    font-size: 1.1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .checkout-button:hover {
    background-color: #2980b9;
  }
  
  .apply-voucher-button {
    background-color: #2ecc71;
    color: white;
    padding: 12px 25px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .apply-voucher-button:hover {
    background-color: #27ae60;
  }
  
  /* Modal styles */
  .voucher-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .voucher-modal-content {
    background-color: #fff;
    padding: 25px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    max-height: 80vh; /* Set a maximum height for the modal */
    overflow-y: auto; /* Enable vertical scrolling */
  }
  
  .voucher-modal-content h4 {
    margin-bottom: 15px;
  }
  
  .voucher-modal-content ul {
    list-style-type: none;
    padding: 0;
  }
  
  .voucher-modal-content li {
    margin-bottom: 12px;
  }
  
  .voucher-modal-content button {
    background-color: #f39c12;
    color: white;
    padding: 8px 18px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .voucher-modal-content button:hover {
    background-color: #e67e22;
  }
  
  .close-modal,
  .exit-modal {
    background-color: #e74c3c;
    color: white;
    padding: 8px 18px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .close-modal:hover,
  .exit-modal:hover {
    background-color: #c0392b;
  }
  </style>
  