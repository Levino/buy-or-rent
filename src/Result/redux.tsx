import { State } from 'src/store'
import { Data, PeriodsArray } from '../helpers'

const SAVE_RESULT = 'SAVE_RESULT'

const result = (state = {
  data: {
    buyerData: {
      equity: 0,
      priceIncreasePerPeriod: 0,
    },
    loanData: {
      loanAmount: 0,
      loanPayment: 0,
    },
  },
  periods: {},
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
      value,
    }
  },
}

export interface Result {
  data: Data
  periods: PeriodsArray
}

export const selectors = {
  getResult: (state: State): Result => state.result,
}

export default result
