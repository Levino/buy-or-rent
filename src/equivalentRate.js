export const SET_RATE = 'buyOrRent/equivalentRate/SET_RATE'
export const CALCULATE_RATE = 'buyOrRent/equivalentRate/CALCULATE_RATE'

export const equivalentRate = (state = 0.06, action) => {
  if (action.type === SET_RATE) {
    return action.value
  }
  if (action.type === CALCULATE_RATE) {
    return 0.05
  }
  return state
}

export const getEquivalentRate = state => state.equivalentRate
