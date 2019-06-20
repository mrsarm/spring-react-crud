const axios = require('axios')

const client = axios.create({
  baseURL: '/api/',
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

module.exports = client
