import Api from './Api'

export default {
  register(credentials) {
    return Api().post('/auth/signup', credentials)
  },

  async login(credentials) {
    return await Api().post('/auth/login', credentials)
  },
}
