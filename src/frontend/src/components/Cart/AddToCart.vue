<script>
import { CartStore } from '../../store/Cart'
import { useToast } from 'vue-toastification'
import { UserStore } from '@/store/User'
import axios from 'axios'

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const toast = useToast()

    const addToCart = async () => {
      const userID = UserStore().user.userID
      const quant = 1

      try {
        // Call the API to add the product to the cart
        const response = await axios.put('http://127.0.0.1:3000/checkout/cart/items/add', {
          userID,
          prodID: props.product.prodID,
          quantity: quant,
        })

        // Show success toast
        if (response.status === 200) {
          toast.success('Added to cart successfully', { timeout: 1000 })
        }
      } catch (error) {
        toast.error('Error adding to cart')
      }
    }

    return { addToCart }
  },
}
</script>

<template>
  <button class="btn btn-outline-primary" @click.prevent="addToCart">Add to Cart</button>
</template>

<style scoped>
/* Style for the button */
.btn-outline-primary {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.btn-outline-primary:hover {
  background-color: #0056b3;
}
</style>
