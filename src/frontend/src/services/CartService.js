import Api from './Api'

export default {
  async getCart(credentials) {
    return await Api().get(`/cart`, credentials)
  },

  async postCart(credentials, headers) {
    return await Api().post('/cart', credentials, {
      headers: headers, // Use the provided header object
    })
  },
}
