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
      // console.log(uStore.getToken)
      const response = await CartService.getCart({
        headers: { Authorization: `Bearer ${uStore.getToken}` },
      })
      console.log('cart', response.data)

      this.cartID = 'cart-' + uStore.user.id

      this.cart = response.data || []

      // this.cart =
    },
    addItem(product, quantity = 1) {
      const existingItem = this.cart.find((item) => item.prodID === product.prodID)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.cart.push({ ...product, quantity: quantity })
      }
      // this.postCart()
    },

    updateQuantity(productId, quantity) {
      const item = this.cart.find((item) => item.prodID === productId)
      if (item) {
        item.quantity = quantity
      }
      // this.postCart()
    },

    clearCart() {
      this.cart = []
      // this.postCart()
    },

    async postCart() {
      const uStore = UserStore()
      const headers = {
        Authorization: `Bearer ${uStore.getToken}`, // Replace with actual token
        'Content-Type': 'application/json', // Set Content-Type to JSON
      }

      // console.log('token', uStore.getToken)
      // console.log(this.cart)
      const response = await CartService.postCart({ cart: this.cart }, headers)
      console.log(response)
    },
  },
  getters: {
    itemCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
  },
})
