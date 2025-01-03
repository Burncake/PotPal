import Api from './Api'

export default {
  async register(credentials) {
    return await Api().post('/account/register', credentials)
  },

  async login(credentials) {
    return await Api().post('/account/login', credentials)
  },
}
