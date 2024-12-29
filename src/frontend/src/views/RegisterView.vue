<script>
import AuthenticationService from '@/services/AuthenticationService'
import { UserStore } from '@/store/User'

export default {
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
      fullname: '',
      address: '',
      phoneNumber: '',
      email: '',
      message: '',

      store: UserStore(),

      data: {},
    }
  },

  methods: {
    checkRePassword() {
      console.log(this.password, this.repassword)
      return this.password === this.repassword
    },
    async register() {
      if (!this.checkRePassword()) {
        this.message = 'Your password do not match'
        return
      }
      try {
        const response = await AuthenticationService.register({
          userName: this.username,
          password: this.password,
          fullName: this.fullname,
          email: this.email,
          address: this.address,
          phoneNumber: this.phoneNumber,
          role: "customer",
          userStatus: "active",
        })
        this.data = response.data
        this.store.setToken(this.data.tokens)
        this.store.setUser(this.data)

        this.$router.push('/')
      } catch (error) {
        console.log('err', error)
        this.message = error.response.data.message
      }
    },
    reload(page) {
      window.location.href = '/' + page
    },
  },
}
</script>
<template>
  <div class="col-6 col-md-4 col-xxl-2 mt-5 mx-auto">
    <form @submit.prevent="register">
      <div class="text-center mb-3">
        <p>Sign up with</p>
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

      <!-- Name input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerName">Full Name</label>
        <input type="text" id="registerName" class="form-control" v-model="name" required />
      </div>

      <!-- Username input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerUsername">Username</label>
        <input type="text" id="registerUsername" class="form-control" v-model="username" required />
      </div>

      <!-- Email input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerEmail">Email</label>
        <input type="email" id="registerEmail" class="form-control" v-model="email" required />
      </div>

      <!-- Address input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerAddress">Address</label>
        <input type="text" id="registerAddress" class="form-control" v-model="address" required />
      </div>

      <!-- Phone Number input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerPhoneNumber">Phone Number</label>
        <input type="text" id="registerPhoneNumber" class="form-control" v-model="phoneNumber" required />
      </div>

      <!-- Password input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerPassword">Password</label>
        <input
          type="password"
          id="registerPassword"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <!-- Repeat Password input -->
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="registerRepeatPassword">Repeat Password</label>
        <input
          type="password"
          id="registerRepeatPassword"
          class="form-control"
          required
          v-model="repassword"
        />
      </div>
      <input type="hidden" name="Permission" value="1" />

      <!-- Checkbox -->
      <div class="form-check d-flex justify-content-center mb-4">
        <input
          class="form-check-input me-2"
          type="checkbox"
          value=""
          id="registerCheck"
          checked
          aria-describedby="registerCheckHelpText"
        />
        <label class="form-check-label" for="registerCheck">
          I have read and agree to the terms
        </label>
      </div>

      <div class="form-check d-flex justify-content-center mb-4">
        <p id="message" style="color: red">{{ message }}</p>
      </div>
      <!-- Submit button -->

      <!-- {{!-- <button type="submit" class="btn btn-primary">Submit</button> --}} -->
      <div class="text-center">
        <button type="submit" data-mdb-ripple-init class="btn btn-primary btn-block mb-3">
          Sign up
        </button>
      </div>
      <div class="text-center">
        <p>
          Already have an account?

          <RouterLink class="dropdown-item" to="/login"><a href="">Log in</a></RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
#message {
  color: red;
}
</style>
