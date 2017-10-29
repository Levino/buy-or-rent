import React from 'react';
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { equivalentRate } from "./equivalentRate"
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {getCalculatedEquivalentRate} from "./selectors"

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  equivalentRate,
  form: formReducer
})

const store = createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

console.log(getCalculatedEquivalentRate(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
