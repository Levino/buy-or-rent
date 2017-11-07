import { types } from './sagas'
import { combineReducers } from 'redux'

const {
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED,
  CALCULATE_PERIODS_SUCCEEDED,
  CALCULATE_PERIODS_REQUESTED
} = types

export const equivalentRate = (state = {rate: 10 / 12, status: 'done'}, action) => {
  if (action.type === EQUIVALENT_RATE_CALCULATION_SUCCEEDED) {
    return {
      rate: action.value,
      status: 'done'
    }
  }
  if (action.type === EQUIVALENT_RATE_CALCULATION_REQUESTED) {
    return {
      ...state,
      status: 'calculating'
    }
  }
  return state
}

export const periods = (state = {calculating: false}, action) => {
  if (action.type === CALCULATE_PERIODS_SUCCEEDED) {
    return {
      ...action.value,
      calculating: false
    }
  }
  if (action.type === CALCULATE_PERIODS_REQUESTED) {
    return {
      ...state,
      calculating: true
    }
  }
  return state
}

const SAVE_FORM_DATA = 'SAVE_FORM_DATA'

export const data = (state = {}, action) => {
  if (action.type === SAVE_FORM_DATA) {
    return action.values
  }
  return state
}

export const actions = {
  saveFormData(values: any) {
    return {
      type: SAVE_FORM_DATA,
      values
    }
  }
}

export const getEquivalentRate = state => state.app.equivalentRate.rate
export const getEquivalentRateStatus = state => state.app.equivalentRate.status

export default combineReducers({
  periods,
  data,
  equivalentRate
})
