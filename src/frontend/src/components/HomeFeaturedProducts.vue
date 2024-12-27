<template>
    <div class="container mt-5 pt-3">
        <h3 class="text-center mb-4">Featured Products</h3>
        <div class="border-bottom mb-5"></div>
        <div class="row">
            <div v-for="(product, index) in featuredProducts" :key="index" class="col-md-3 mb-4">
                <div class="card p-3 h-100 border-0 shadow-sm">
                    <div class="card-img">
                        <img :src="product.mainImage" alt="Product Image">
                    </div>
                    <div class="card-body align-self-bottom">
                        <h6 class="card-title"><router-link :to="'/product/' + product.prodID">{{ product.prodName}}</router-link></h6>
                        <p class="card-text p-0 mb-0 mt-3"><strong>Price: ${{ product.price }}</strong></p>
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
            featuredProducts: []
        };
    },
    mounted() {
    fetch("https://6754193836bcd1eec85023b2.mockapi.io/api/products")
        .then(response => response.json())
        .then(data => {
            console.log("Home Featured product Fetched Data:", data); // In toàn bộ dữ liệu lên console
            this.featuredProducts = data.slice(0, 4);
        })
        .catch(error => {
            console.error("Error fetching featured products:", error);
        });
    }
}
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