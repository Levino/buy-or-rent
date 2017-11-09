import * as React from 'react'

import { withReduxSaga } from '../src/store'
import App from '../src/App'
import ReactGA from 'react-ga'
import { Component } from 'react'

ReactGA.initialize('UA-109415206-1', {
  gaOptions: {
    anonymizeIp: true
  }
})

class BuyOrRent extends Component {
  componentDidMount() {
    ReactGA.pageView(window.location.pathname)
  }
  render() {
    return <App/>
  }
}

export default withReduxSaga(BuyOrRent)
