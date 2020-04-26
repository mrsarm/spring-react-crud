const axios = require('axios')

const client = axios.create({
  baseURL: '/api/',
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

const get = axios.create({
  method: 'get',
  baseURL: '/api/',
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

const post = axios.create({
  method: 'post',
  baseURL: '/api/',
  //timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
})

const put = axios.create({
  method: 'put',
  baseURL: '/api/',
  //timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
})

const del = axios.create({
  method: 'delete',
  baseURL: '/api/',
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

export {client, get, post, put, del}
