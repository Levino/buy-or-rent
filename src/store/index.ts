import nextReduxSaga from 'next-redux-saga'
import withRedux from 'next-redux-wrapper'
import { equivalentRate, periods } from '../reducers'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import createInitialState from './initialState'
import { rootSaga } from '../sagas'
declare var window:any

export const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  equivalentRate,
  periods,
  form: formReducer
})

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const configureStore = (initialState = createInitialState() ) => {
  const store: any = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware))
  )

  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

export function withReduxSaga (BaseComponent) {
  return withRedux(configureStore)(nextReduxSaga(BaseComponent))
}
