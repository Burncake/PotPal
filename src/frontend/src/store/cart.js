import { defineStore } from 'pinia'
import { useProductStore } from './products'
import { CART_STORAGE } from '@/composeables/usePersistCart'

export const useCartStore = defineStore({
  id: 'cart',

  state: () => ({
    // Initialize contents from localStorage or set an empty object
    contents: JSON.parse(localStorage.getItem(CART_STORAGE) || '{}'),
  }),

  getters: {
    // Calculate the total number of items in the cart
    count() {
      return Object.keys(this.contents).reduce((acc, id) => {
        return acc + this.contents[id].quantity
      }, 0)
    },

    // Calculate the total cost of the items in the cart
    total() {
      const productStore = useProductStore()
      return Object.keys(this.contents).reduce((acc, id) => {
        const product = productStore.items[id]
        if (product) {
          return acc + product.price * this.contents[id].quantity
        }
        return acc
      }, 0)
    },

    // Return a formatted preview of the cart items
    formattedCart() {
      const productStore = useProductStore()

      // Wait for products to be loaded
      if (!productStore.loaded) return []

      return Object.keys(this.contents).map((productId) => {
        const purchase = this.contents[productId]
        const product = productStore.items[productId]

        return {
          id: purchase.productId,
          image: product ? product.image : '',
          title: product ? product.title : '',
          quantity: purchase.quantity,
          cost: purchase.quantity * (product ? product.price : 0),
        }
      })
    },
  },

  actions: {
    // Add a product to the cart
    add(productId) {
      if (this.contents[productId]) {
        this.contents[productId].quantity += 1
      } else {
        this.contents[productId] = {
          productId,
          quantity: 1,
        }
      }
      this.saveCart()
    },

    // Remove a product from the cart
    remove(productId) {
      if (!this.contents[productId]) return

      this.contents[productId].quantity -= 1

      if (this.contents[productId].quantity === 0) {
        delete this.contents[productId]
      }
      this.saveCart()
    },

    // Save cart data to localStorage
    saveCart() {
      localStorage.setItem(CART_STORAGE, JSON.stringify(this.contents))
    },

    // Clear the cart
    clearCart() {
      this.contents = {}
      localStorage.removeItem(CART_STORAGE)
    },
  },
})