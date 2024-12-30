import Api from './Api'

export default {
  async register(data) {
    data.role = "customer"
    data.userStatus = "active"
    data.tokens = Math.floor(Math.random() * 1000)
    data.avatar = "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
    return await Api().post('/user', data)
  },

  async login(credentials) {
    return await Api().get('/user', { params: { userName: credentials.userName } })
  },
}
