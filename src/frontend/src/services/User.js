import Api from './Api'

export default {
  async getUser(credentials) {
    console.log(credentials)
    return await Api().get('/user/profile', credentials)
  },

  async getAll(headers) {
    return await Api().get('/user', {
      headers: headers,
    })
  },
  async upload(user, headers) {
    return await Api().post('/user', user, {
      headers: headers,
    })
  },
  async update(id, user, headers) {
    return await Api().put(`/user/${id}`, user, {
      headers: headers,
    })
  },
  async delete(id, headers) {
    return await Api().delete(`/user/${id}`, {
      headers: headers,
    })
  },
}
