import { defineStore } from 'pinia'

export const UserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: (() => {
      try {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      } catch (error) {
        console.error("Invalid JSON in localStorage 'user':", error)
        console.log(error)
        return null // Fallback to null if parsing fails
      }
    })(),
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
    isAdmin(state) {
      return state.user && state.user.priority === 1
    },
  },
  strict: true,
})
