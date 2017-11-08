import { PeriodsArray, theData } from '../helpers'

const SAVE_RESULT = 'SAVE_RESULT'

const result = (state = {
  periods: {},
  data: {
    loanData: {
      loanAmount: 0,
      loanPayment: 0,
    },
    buyerData: {
      priceIncreasePerPeriod: 0,
      equity: 0
    }
  }
}, action) => {
  if (action.type === SAVE_RESULT) {
    return action.value
  }
  return state
}

export const actions = {
  saveResult(value: any) {
    return {
      type: SAVE_RESULT,
      value
    }
  }
}

export type Result = {
  data: theData
  periods: PeriodsArray
}

export const selectors = {
  getResult: (state): Result => state.result
}

export default result
