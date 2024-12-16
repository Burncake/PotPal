<script>
import { useStore } from '@/store/Store'
export default {
  data() {
    return {
      isLoggedIn: false,

      store: useStore(),
    }
  },
  methods: {
    reload(page) {
      window.location.href = '/' + page
    },
    logOut() {
      this.store.$reset()
      this.$router.push('/')
    },
  },
}
</script>

<template>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
    <template v-if="!this.store.isLoggedIn">
      <li>
        <RouterLink class="dropdown-item" to="/login" @click.prevent="reload('login')"
          >Login</RouterLink
        >
        <!-- <a @click="goToLogin" class="dropdown-item" href="#">Login</a> -->
      </li>
      <li>
        <RouterLink class="dropdown-item" to="/register" @click.prevent="reload('register')"
          >Signup</RouterLink
        >
      </li>
    </template>
    <template v-else>
      <li>
        <a class="dropdown-item" href="#">Profile</a>
        <a class="dropdown-item" href="#" @click="logOut">Logout</a>
      </li>
    </template>
  </ul>
</template>