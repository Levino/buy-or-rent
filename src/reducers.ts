import { types } from './sagas'

const {
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED,
  CALCULATE_PERIODS_SUCCEEDED
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

export const periods = (state = {}, action) => {
  if (action.type === CALCULATE_PERIODS_SUCCEEDED) {
    return action.value
  }
  return state
}

export const getEquivalentRate = state => state.equivalentRate.rate
export const getEquivalentRateStatus = state => state.equivalentRate.status
