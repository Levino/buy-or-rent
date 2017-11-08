import { types } from './sagas'

const {
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED,
} = types

export const calculating = (state: boolean = false, action): boolean => {
  if (action.type === EQUIVALENT_RATE_CALCULATION_SUCCEEDED) {
    return false
  }
  if (action.type === EQUIVALENT_RATE_CALCULATION_REQUESTED) {
    return true
  }
  return state
}

const getCalculating = (state): boolean => state.calculating

export const selectors = {
  getCalculating
}

export default calculating
