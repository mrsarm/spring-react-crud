'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import {client} from './client'
import App from './components/App'


window.client = client   // To be accessible from the browser to debug requests

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
