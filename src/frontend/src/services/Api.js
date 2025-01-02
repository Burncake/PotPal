import axios from 'axios'

export default () => {
  return axios.create({
    // baseURL: 'http://localhost:3000/',
    baseURL: 'https://67628fc046efb373237507fb.mockapi.io/',
  })
}
