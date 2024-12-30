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
    const cartStore = CartStore()
    const toast = useToast()

    // Fetch the cart by customerID from the API
    const getCartByCustomer = async (customerID) => {
      try {
        const response = await axios.get(`https://67628fc046efb373237507fb.mockapi.io/carts?customerID=${customerID}`)
        return response.data
      } catch (error) {
        toast.error('Error fetching cart')
      }
    }

    const updateCart = async (updatedCart) => {
      try {
        // Assuming CART001 is a cartID for simplicity, you can dynamically set this if needed.
        await axios.put(`https://67628fc046efb373237507fb.mockapi.io/carts/${updatedCart.cartID}`, updatedCart)
      } catch (error) {
        toast.error('Error updating cart')
      }
    }

    const addToCart = async () => {
      const customerID = UserStore().user.userID
      const quant = 1

      // Get the customer's cart
      const carts = await getCartByCustomer(customerID)

      if (carts && carts.length > 0) {
        const cart = carts[0] // Assuming the customer has only one cart, or you can handle multiple carts

        // Check if the product already exists in the cart
        const existingItem = cart.cartsDetail.find(item => item.prodID === props.product.prodID)
        if (existingItem) {
          // Update quantity if product already exists
          existingItem.quantity += quant
        } else {
          // Add new product to cart
          cart.cartsDetail.push({
            cartID: cart.cartID,
            prodID: props.product.prodID,
            quantity: quant,
          })
        }

        // Save the updated cart
        await updateCart(cart)

        // Show success toast
        toast.success('Added to cart', {
          timeout: 1000,
        })
      } else {
        // If no cart exists for the customer, create a new one
        const newCart = {
          customerID,
          createAt: new Date().toISOString(),
          cartsDetail: [{
            cartID: `CART${new Date().getTime()}`, // Generating a new cartID
            prodID: props.product.prodID,
            quantity: quant,
          }],
        }

        try {
          // Create a new cart for the customer
          await axios.post('https://67628fc046efb373237507fb.mockapi.io/carts', newCart)

          // Show success toast
          toast.success('Added to cart', {
            timeout: 1000,
          })
        } catch (error) {
          toast.error('Error creating new cart')
        }
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
