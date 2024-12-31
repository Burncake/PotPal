<template>
    <section id="about" class="py-5">
      <div class="container">
        <!-- Header Section -->
        <header class="text-center mb-5">
          <h1 class="section-heading text-uppercase text-primary">Welcome to PotPal</h1>
          <p class="text-muted lead">Where Innovation Meets Style</p>
        </header>
  
        <!-- Story and Philosophy Section -->
        <div class="row mb-5">
          <div class="col-lg-6">
            <article class="mb-4">
              <h2 class="text-uppercase text-primary h3">Our Story</h2>
              <div class="content">
                <p class="text-muted">
                  At PotPal, we believe in transforming ordinary shopping experiences into extraordinary adventures.
                </p>
                <p class="text-muted">
                  Founded with a passion for innovation and an eye for elegance, PotPal is your 
                  go-to online destination for all things trendy and timeless.
                </p>
                <p class="text-muted">
                  In the bustling world of e-commerce, PotPal stands out as a beacon of creativity and 
                  convenience.
                </p>
              </div>
            </article>
          </div>
          <div class="col-lg-6">
            <article class="mb-4">
              <h2 class="text-uppercase text-primary h3">Our Philosophy</h2>
              <div class="content">
                <p class="text-muted">
                  At the heart of PotPal lies a deep-rooted philosophy that guides every interaction, 
                  every purchase, and every moment you spend with us. 
                </p>
                <p class="text-muted">
                  We believe in the power of choice, the joy of discovery, and the thrill of finding something special.
                </p>
                <p class="text-muted">
                  PotPal curate a handpicked selection of products, each telling a unique story of 
                  craftsmanship and quality.
                </p>
              </div>
            </article>
          </div>
        </div>
  
        <!-- Features Section -->
        <section class="features">
          <h2 class="text-uppercase text-primary text-center h3 mb-4">Why Choose PotPal?</h2>
          <div class="row g-4">
            <div class="col-md-4" v-for="(feature, index) in features" :key="index">
              <div class="feature-card p-4 h-100 border rounded">
                <h3 class="h5 text-primary">{{ feature.title }}</h3>
                <p class="text-muted mb-0">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </template>
  
<script>
export default {
name: 'AboutPage',
data() {
    return {
    features: [
        {
            title: 'Exceptional Quality',
            description: 'Products undergo rigorous quality checks to ensure you receive nothing but the best.'
        },
        {
            title: 'Trendsetting Style',
            description: 'Your window to the latest fashion trends, tech innovations, and lifestyle inspirations.'
        },
        {
            title: 'Secure Shopping',
            description: 'Advanced encryption technology to protect your personal information and transactions.'
        },
        {
            title: '24/7 Customer Support',
            description: 'Dedicated customer service team available round the clock to assist you with any queries.'
        },
        {
            title: 'Fast Shipping',
            description: 'Swift delivery services to get your favorite products to your doorstep in no time.'
        },
        {
            title: 'Easy Returns',
            description: 'Hassle-free return policy for a seamless shopping experience.'
        }
    ]
    }
}
}
</script>

<style scoped>
.feature-card {
transition: transform 0.3s ease, box-shadow 0.3s ease;
background: white;
}

.feature-card:hover {
transform: translateY(-5px);
box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.lead {
font-size: 1.25rem;
}
</style>
