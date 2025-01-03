import { defineStore } from 'pinia'
import { UserStore } from './User'
import CartService from '@/services/CartService'

export const CartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    cartID: null,
  }),

  actions: {
    async loadCart() {
      const uStore = UserStore()
      const customerID = uStore.user.id // Use user ID as customerID

      try {
        const response = await CartService.getCart(customerID)
        if (response.data.length > 0) {
          const cartData = response.data[0] // Assuming a single cart per customer
          this.cartID = cartData.cartID
          this.cart = cartData.cartsDetail || []
        } else {
          this.cart = [] // No cart data for this user, initialize empty cart
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    },

    async saveCart() {
      const uStore = UserStore()
      const headers = {
        Authorization: `Bearer ${uStore.getToken}`,
        'Content-Type': 'application/json',
      }

      if (this.cartID) {
        // Update existing cart
        await CartService.updateCart(this.cartID, this.cart, headers)
      } else {
        // Create new cart
        const customerID = uStore.user.id
        await CartService.postCart(customerID, this.cart, headers)
      }
    },

    addItem(product, quantity = 1) {
      const existingItem = this.cart.find((item) => item.prodID === product.prodID)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.cart.push({ ...product, quantity })
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.cart.find((item) => item.prodID === productId)
      if (item) {
        item.quantity = quantity
      }
    },

    clearCart() {
      this.cart = []
    },
  },

  getters: {
    itemCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
  },
})
