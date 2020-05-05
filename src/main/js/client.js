const axios = require('axios')

const appData = document.querySelector('#app-data').dataset
const apiBaseUrl = appData.apiUrl || '/api'

const client = axios.create({
  baseURL: apiBaseUrl,
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

const get = axios.create({
  method: 'get',
  baseURL: apiBaseUrl,
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

const post = axios.create({
  method: 'post',
  baseURL: apiBaseUrl,
  //timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
})

const put = axios.create({
  method: 'put',
  baseURL: apiBaseUrl,
  //timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
})

const del = axios.create({
  method: 'delete',
  baseURL: apiBaseUrl,
  //timeout: 1000,
  headers: {'Accept': 'application/hal+json'}
})

export {client, get, post, put, del}
