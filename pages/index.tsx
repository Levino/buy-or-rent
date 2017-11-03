import * as React from 'react'

import { withReduxSaga } from '../src/store'
import App from '../src/App'

const BuyOrRent = () => (
  <App/>
)
export default withReduxSaga(BuyOrRent)
