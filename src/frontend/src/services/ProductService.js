import Api from './Api'

export default {
  async getAll() {
    return await Api().get('/product')
  },

  //   async login(credentials) {
  //     return await Api().post('/auth/login', credentials)
  //   },
}
