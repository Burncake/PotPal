<script setup>
import Product from './ProductItem.vue'
</script>
<script>
export default {
  data() {
    return {
      products: [],
    }
  },
  props: {
    title: String,
  },
  methods: {
    async getData() {
      let response = await fetch('https://fakestoreapi.com/products?limit=8')
      // console.log(data)
      let jsonData = await response.json()
      console.log(jsonData)
      this.products = jsonData
    },
  },
  mounted() {
    this.getData()
  },
  computed: {
    chunkList() {
      const chunkSize = 4
      const result = []
      for (let i = 0; i < this.products.length; i += chunkSize) {
        result.push(this.products.slice(i, i + chunkSize))
      }
      console.log(this.products)
      return result
    },
  },
}
</script>

<template>
  <div class="row">
    <div class="col-10 mx-auto">
      <h3 class="my-3 fw-bold">{{ title }}</h3>
    </div>
  </div>
  <div class="row d-flex justify-content-center align-items-center" id="newproducts">
    <div class="col-1 text-right">
      <a class="btn mb-3 mr-1" data-bs-target="#carouselExample" role="button" data-bs-slide="prev">
        <i class="fa-solid fa-angle-left fa-xl"></i>
      </a>
    </div>

    <div id="carouselExample" class="carousel slide mt-2 col-10">
      <div class="carousel-inner">
        <template v-for="(chunk, index) in chunkList" :key="index">
          <div :class="{ 'carousel-item': true, active: index == 1 }">
            <div class="row d-flex justify-content-around">
              <template v-for="(item, i) in chunk" :key="i">
                <div class="col-12 col-md-5 col-xxl-3">
                  <Product>
                    <template #image>
                      <img :src="item.image" class="img-fluid" />
                    </template>
                    <template #title>
                      <div class="card-title">{{ item.title }}</div>
                    </template>
                    <template #price>
                      <div class="card-text">{{ item.price }}</div>
                    </template>
                  </Product>
                </div>
              </template>
            </div>
          </div>
        </template>
        <!-- <div class="carousel-item active">
          <div class="row d-flex justify-content-around">
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="row d-flex justify-content-around">
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
            <div class="col-12 col-md-5 col-xxl-3"><Product /></div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="col-1 text-right">
      <a
        class="btn mb-3"
        :href="'#' + normalizedTitle"
        role="button"
        data-bs-slide="next"
        data-bs-target="#carouselExample"
      >
        <i :id="normalizedTitle" class="fa-solid fa-angle-right fa-xl"></i>
      </a>
    </div>
  </div>
</template>

<style scoped></style>
