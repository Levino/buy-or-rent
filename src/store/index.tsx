import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'src/sagas'
import calculating from '../reducers'
import result, { Result } from '../Result/redux'
import createInitialState from './initialState'
declare var window: any

export interface State {
  calculating: boolean
  form: any,
  result: Result,
}


export const sagaMiddleware = createSagaMiddleware()

const rootReducer: (state: State, action: any) => State = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  calculating,
  form: formReducer,
  result,
})

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

export const configureStore = (initialState: State = createInitialState()) => {
  const store: any = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )
  sagaMiddleware.run(rootSaga)
  return store
}
