import * as React from 'react'

import { withReduxSaga } from '../src/store'
import App from '../src/App'
import { actions } from '../src/sagas'

class BuyOrRent extends React.Component {
  static async getInitialProps ({store, req, isServer}) {
    if (isServer) {
      store.dispatch(actions.calculatePeriods())
      store.dispatch(actions.calculateEquivYield())
    }
  }

  render () {
    return <App/>
  }
}

export default withReduxSaga(BuyOrRent)
