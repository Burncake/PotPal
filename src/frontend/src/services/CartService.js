import Api from './Api'

export default {
  // Fetch the cart for a specific customer
  async getCart(customerID) {
    return await Api().get(`/carts?customerID=${customerID}`)
  },

  // Add or update the cart for a specific customer
  async postCart(customerID, cartDetails, headers) {
    const cart = {
      customerID: customerID,
      createAt: new Date().toISOString(),
      cartsDetail: cartDetails,
    }
    
    // Check if the cart exists, and if not, create it
    return await Api().post('/carts', cart, { headers: headers })
  },

  // Update an existing cart
  async updateCart(cartID, cartDetails, headers) {
    return await Api().put(`/carts/${cartID}`, { cartsDetail: cartDetails }, { headers: headers })
  }
}
