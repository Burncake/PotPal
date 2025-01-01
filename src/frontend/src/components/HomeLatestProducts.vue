<template>
    <div class="container mt-5 pt-3">
        <h3 class="text-center mb-4">Latest Products</h3>
        <div class="border-bottom mb-5"></div>
        <div class="row">
            <div v-for="(product, index) in lastestProducts" :key="index" class="col-md-3 mb-4">
                <div class="card p-3 h-100 border-0 shadow-sm">
                    <div class="card-img">
                        <img :src="product.mainImage" alt="Product Image">
                    </div>
                    <div class="card-body align-self-bottom">
                        <h6 class="card-title"><router-link :to="'/product/' + product.prodID">{{ product.prodName}}</router-link></h6>
                        <p class="card-text p-0 mb-0 mt-3"><strong>Price: ${{ product.price }}</strong></p>
                        <!-- Display star rating -->
                        <!--<
                        div class="star-rating p-0 m-0">
                            {{ generateStarRating(product.rating.rate) }} ({{ product.rating.count }})
                        </div>
                        -->
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
      lastestProducts: []
    };
  },
  mounted() {
    fetch("http://localhost:3000/product/general/all")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        if (result.status === "success" && result.data) {
          this.lastestProducts = result.data;
        } else {
          console.error("Unexpected API response:", result);
        }
      })
      .catch(error => {
        console.error("Error fetching latest products:", error);
      });
  }
};
</script>


<style scoped>
a {
    text-decoration: none;
    color: #000;
}

a:hover {
    text-decoration: underline;
    opacity: 0.8;
}
.card{
    transition: all 0.3s ease;
    cursor: pointer;
}
.card:hover {
    transform: scale(1.05);
}
.card-text {
    font-weight: 300;
}

.border-bottom {
    width: 200px;
    margin: auto;
}

.card-img {
    text-align: center;
}

.card-body {
    position: relative;
    bottom: 0;
}


img {
    width: 200px;
    height: 200px;
    object-fit: contain;
}

.star-rating {
    font-size: 15px;
    color: #FFD700;
}
</style>
