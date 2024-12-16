import { defineStore } from 'pinia'

export const UserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isLoggedIn: localStorage.getItem('token') !== null,
  }),

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', this.token)
      if (token) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(this.user))
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    // isAuthenticated: (state) => !!state.token,
  },
  strict: true,
})
