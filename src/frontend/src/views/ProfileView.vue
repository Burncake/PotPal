<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading profile information...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else class="profile-content">
      <!-- Profile Form -->
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            v-model="profileData.fullName"
            :class="{ 'is-invalid': errors.fullName }"
            required
          />
          <div class="invalid-feedback" v-if="errors.fullName">
            {{ errors.fullName }}
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="profileData.email"
            :class="{ 'is-invalid': errors.email }"
            required
          />
          <div class="invalid-feedback" v-if="errors.email">
            {{ errors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            v-model="profileData.phoneNumber"
            :class="{ 'is-invalid': errors.phoneNumber }"
          />
          <div class="invalid-feedback" v-if="errors.phoneNumber">
            {{ errors.phoneNumber }}
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea
            id="address"
            v-model="profileData.address"
            :class="{ 'is-invalid': errors.address }"
            rows="3"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.address">
            {{ errors.address }}
          </div>
        </div>

        <div class="form-group">
          <label for="avatar">Profile Picture URL</label>
          <input
            type="url"
            id="avatar"
            v-model="profileData.avatar"
            :class="{ 'is-invalid': errors.avatar }"
            placeholder="https://example.com/avatar.jpg"
          />
          <div class="invalid-feedback" v-if="errors.avatar">
            {{ errors.avatar }}
          </div>
        </div>

        <div class="profile-actions">
          <button type="submit" class="update-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="updateSuccess" class="success-message">Profile updated successfully!</div>
    </div>
  </div>
</template>

<script>
import { UserStore } from '@/store/User'

export default {
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: '',
      isSubmitting: false,
      updateSuccess: false,
      profileData: {
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatar: '',
      },
      errors: {},
    }
  },
  computed: {
    userName() {
      return UserStore().user.userName
    },
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await fetch(`http://localhost:3000/account/${this.userName}`)
        if (!response.ok) throw new Error('Failed to fetch profile data')

        let userData = await response.json()
        userData = userData.data
        console.log('User Data:', userData.data)
        this.profileData = {
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          avatar: userData.avatar || '',
        }
        this.loading = false
      } catch (error) {
        this.error = true
        this.errorMessage = 'Failed to load profile information'
        this.loading = false
      }
    },

    validateForm() {
      this.errors = {}

      if (!this.profileData.fullName.trim()) {
        this.errors.fullName = 'Name is required'
      }

      if (!this.profileData.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.profileData.email)) {
        this.errors.email = 'Please enter a valid email'
      }

      if (this.profileData.phoneNumber && !this.isValidPhone(this.profileData.phoneNumber)) {
        this.errors.phoneNumber = 'Please enter a valid phone number'
      }

      return Object.keys(this.errors).length === 0
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    isValidPhone(phone) {
      return /^\+?[\d\s-]{10,}$/.test(phone)
    },

    async updateProfile() {
      if (!this.validateForm()) return

      this.isSubmitting = true
      this.updateSuccess = false

      try {
        const response = await fetch(
          `https://67628fc046efb373237507fb.mockapi.io/user/${this.userID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.profileData),
          },
        )

        if (!response.ok) throw new Error('Failed to update profile')

        const updatedUser = await response.json()
        UserStore().setUser(updatedUser)
        this.updateSuccess = true

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false
        }, 3000)
      } catch (error) {
        this.error = true
        this.errorMessage = 'Failed to update profile'
      } finally {
        this.isSubmitting = false
      }
    },
  },
  mounted() {
    this.fetchProfile()
  },
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f8fafc;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.profile-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.is-invalid {
  border-color: #dc2626 !important;
}

.invalid-feedback {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.update-button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-button:hover:not(:disabled) {
  background: #1d4ed8;
}

.update-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.error-state {
  color: #dc2626;
}

@media (max-width: 640px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-header h1 {
    font-size: 2rem;
  }

  .profile-content {
    padding: 1.5rem;
  }
}
</style>
