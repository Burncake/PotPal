<script>
import { CartStore } from '../../store/Cart'
import { useToast } from 'vue-toastification'
export default {
  setup() {
    const cartStore = CartStore()
    const toast = useToast()
    return { cartStore, toast }
  },
  data() {
    return {}
  },
  props: {
    product: Object,
  },
  methods: {
    addToCart() {
      const quant = 1
      console.log(this.product)
      this.cartStore.addItem(this.product, quant)
      console.log(this.cartStore.products)
      console.log('object')
      this.toast.success('Added to cart', {
        timeout: 1000,
      })
      console.log('12234')
      // this.$store.dispatch('cart/addToCart', this.product)
    },
  },
}
</script>
<template>
  <button class="btn btn-outline-primary" @click.prevent="addToCart">Add to Cart</button>
</template>
