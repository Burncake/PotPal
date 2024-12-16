import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({ token: null, user: null, isLoggedIn: false }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    setToken(token) {
      this.token = token
      if (token) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    },
    setUser(user) {
      this.user = user
    },
  },
  strict: true,
})
