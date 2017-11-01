import * as React from 'react'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import * as ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { equivalentRate } from './equivalentRate'
import calcRateSaga, { actions } from './sagas'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  equivalentRate,
  form: formReducer
})

const getInitialState = () => ({
  equivalentRate: {
    rate: 0.1 / 12,
    status: 'done'
  },
  form: {
    mainForm: {
      values: {
        interestRate: 0.02 / 12,
        capGainsTax: 0.25,
        equity: 200000,
        rentPricePerSM: 14,
        buyPricePerSM: 4000,
        periods: 20 * 12,
        investmentReserve: 0.01 / 12,
        size: 100,
        brokerFee: 0.0714,
        notaryFee: 0.015,
        propertyPurchaseTax: 0.065,
        timeToDeath: 50 * 12,
        equityPriceIncrease: 0.02 / 12,
        rentIncreasePerPeriod: 0.02 / 12
      }
    }
  }
})

const store = createStore(
  rootReducer,
  getInitialState(),
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(calcRateSaga)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'))
registerServiceWorker()

store.dispatch(actions.calculateEquivYield())
