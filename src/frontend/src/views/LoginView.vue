<script>
import AuthenticationService from '@/services/AuthenticationService'
import { UserStore } from '@/store/User'

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      data: {},

      store: UserStore(),
      // callback: (response) => {
      //   console.log('Handle the response', response)
      // },
    }
  },
  methods: {
    async login() {
      try {
        const response = await AuthenticationService.login({
          userName: this.username,
          password: this.password,
        })
        this.data = response.data[0]
        this.store.setToken(this.data.tokens)
        this.store.setUser(this.data)
        console.log(this.data)
        this.$router.push('/')
      } catch (error) {
        console.log('err', error)
        this.message = error.response.data.message
      }
    },
  },
}
</script>

<template>
  <!-- Pills navs -->
  <div class="col-6 col-md-4 col-xxl-2 mt-5 mx-auto">
    <!-- Pills navs -->

    <!-- Pills content -->

    <form method="post" @submit.prevent="login">
      <div class="text-center mb-3">
        <p>Sign in with</p>
        <button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          class="btn btn-link btn-floating mx-1"
        >
          <i class="fab fa-facebook-f"></i>
        </button>

        <button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          class="btn btn-link btn-floating mx-1"
        >
          <i class="fab fa-google"></i>
        </button>

        <button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          class="btn btn-link btn-floating mx-1"
        >
          <i class="fab fa-twitter"></i>
        </button>

        <button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          class="btn btn-link btn-floating mx-1"
        >
          <i class="fab fa-github"></i>
        </button>
      </div>

      <p class="text-center">or</p>

      <!-- Email input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="loginName">Username</label>
        <input
          type="text"
          id="loginName"
          class="form-control"
          name="Username"
          v-model="username"
          required
        />
      </div>

      <!-- Password input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="loginPassword">Password</label>
        <input
          type="password"
          id="loginPassword"
          class="form-control"
          name="Password"
          v-model="password"
          required
        />
      </div>

      <div class="d-flex">
        <a href="#!">Forgot password?</a>
      </div>

      <div class="form-check d-flex justify-content-center">
        <p id="message">{{ message }}</p>
      </div>

      <!-- Submit button -->
      <div class="text-center">
        <button type="submit" data-mdb-ripple-init class="btn btn-primary btn-block mb-4">
          Sign in
        </button>
      </div>
      <!-- Register buttons -->

      <div class="text-center">
        <p>
          Not a member?

          <RouterLink class="dropdown-item" to="/register"><a href="">Sign up</a></RouterLink>
        </p>
      </div>
    </form>
  </div>

  <!-- Pills content -->
</template>

<style scoped>
#message {
  color: red;
}
</style>
