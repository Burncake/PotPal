<template>
  <div class="contact-us-container py-5">
    <div class="container">
      <div class="row g-4">
        <!-- Contact Form Section -->
        <div class="col-lg-6">
          <div class="contact-form-wrapper">
            <h2 class="mb-4 text-primary">Get In Touch</h2>
            <p class="text-muted mb-4">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="formData.name"
                  :class="{ 'is-invalid': errors.name }"
                  required
                >
                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="formData.email"
                  :class="{ 'is-invalid': errors.email }"
                  required
                >
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea 
                  class="form-control" 
                  id="message" 
                  rows="5" 
                  v-model="formData.message"
                  :class="{ 'is-invalid': errors.message }"
                  required
                ></textarea>
                <div class="invalid-feedback" v-if="errors.message">
                  {{ errors.message }}
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>

              <!-- Success Message -->
              <div 
                v-if="submitSuccess" 
                class="alert alert-success mt-3"
                role="alert"
              >
                Thank you for your message! We'll get back to you soon.
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="col-lg-6">
          <div class="contact-info-wrapper h-100 d-flex flex-column">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/006/859/994/non_2x/black-letter-telephone-location-and-address-icons-print-screen-on-wooden-cube-block-for-customer-service-contact-concept-free-photo.jpg" 
              alt="Contact Us" 
              class="contact-image rounded mb-4"
            >
            <div class="contact-details mt-auto">
              <h3 class="h4 mb-3">Other Ways to Reach Us</h3>
              <div class="contact-info">
                <p v-for="(info, index) in contactInfo" 
                   :key="index"
                   class="mb-2 d-flex align-items-center">
                  <i :class="info.icon" class="me-2"></i>
                  {{ info.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      submitSuccess: false,
      contactInfo: [
        { icon: 'fas fa-envelope', text: 'support@potpal.com' },
        { icon: 'fas fa-phone', text: '+1 (555) 123-4567' },
        { icon: 'fas fa-map-marker-alt', text: '123 PotPal Street, Tech City, TC 12345' }
      ]
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.formData.name.trim()) {
        this.errors.name = 'Name is required'
      }
      
      if (!this.formData.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Please enter a valid email'
      }
      
      if (!this.formData.message.trim()) {
        this.errors.message = 'Message is required'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    
    async submitForm() {
      if (!this.validateForm()) return
      
      this.isSubmitting = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.submitSuccess = true
        this.resetForm()
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.contact-us-container {
  background-color: #f8f9fa;
}

.contact-form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.contact-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.form-control {
  border: 1px solid #dee2e6;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.contact-info {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.btn-primary {
  padding: 0.5rem 2rem;
  transition: all 0.3s ease;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
