import * as React from 'react'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import * as ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { equivalentRate, periods } from './reducers'
import { actions, calculatePeriodsSaga, calcRateSaga } from './sagas'

import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import { createInitialState } from './store'
declare var window:any;

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  equivalentRate,
  periods,
  form: formReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  createInitialState(),
  composeEnhancers(
  applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(calcRateSaga)
sagaMiddleware.run(calculatePeriodsSaga)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>, document.getElementById('root'))
registerServiceWorker()
store.dispatch(actions.calculatePeriods())
store.dispatch(actions.calculateEquivYield())
