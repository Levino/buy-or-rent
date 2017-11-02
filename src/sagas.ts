import { call, put, takeLatest, select } from 'redux-saga/effects'
import { times } from 'lodash'
import { getTheData } from './selectors'
import {
  assetValuation, calculateEquivalentYield, interestBetween, loanPaymentPerPeriod, netWorth, rentBetweenPeriods,
  restOfLoan,
  savingsBetweenPeriods, stockGainBetweenPeriods, stockValueInPeriod, taxBetweenPeriods,
  theData
} from './helpers'

const EQUIVALENT_RATE_CALCULATION_SUCCEEDED = 'EQUIVALENT_RATE_CALCULATION_SUCCEEDED'
const EQUIVALENT_RATE_CALCULATION_FAILED = 'EQUIVALENT_RATE_CALCULATION_FAILED'
const EQUIVALENT_RATE_CALCULATION_REQUESTED = 'EQUIVALENT_RATE_CALCULATION_REQUESTED'
const CALCULATE_PERIODS_REQUESTED = 'CALCULATE_PERIODS_REQUESTED'
const CALCULATE_PERIODS_FAILED = 'CALCULATE_PERIODS_FAILED'
const CALCULATE_PERIODS_SUCCEEDED = 'CALCULATE_PERIODS_SUCCEEDED'

export const types = {
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_FAILED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED,
  CALCULATE_PERIODS_REQUESTED,
  CALCULATE_PERIODS_FAILED,
  CALCULATE_PERIODS_SUCCEEDED
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* calculateEquivalentRateGenerator(): any {
  const data = yield select(getTheData)
  try {
    const stockYield = yield call(calculateEquivalentYield, data)
    yield put({type: EQUIVALENT_RATE_CALCULATION_SUCCEEDED, value: stockYield})
  } catch (e) {
    yield put({type: EQUIVALENT_RATE_CALCULATION_FAILED, message: e.message})
  }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If 'EQUIVALENT_RATE_CALCULATION_REQUESTED' gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
export function* calcRateSaga() {
  yield takeLatest(EQUIVALENT_RATE_CALCULATION_REQUESTED, calculateEquivalentRateGenerator)
}

export const actions = {
  calculateEquivYield() {
    return {
      type: EQUIVALENT_RATE_CALCULATION_REQUESTED
    }
  },
  calculatePeriods() {
    return {
      type: CALCULATE_PERIODS_REQUESTED
    }
  }
}

const createPeriodsObject = async (data: theData) => {
  const createPeriods = (periodGap: number) => (
    times(data.loanData.totalPeriods).map((period) => ({
      buyerData: {
        loanAmountAtBeginning: restOfLoan(data, period),
        loanPayment: loanPaymentPerPeriod(data, period),
        interest: interestBetween(data, period, period + periodGap),
        loanAmountAtEnd: restOfLoan(data, period + periodGap),
        houseValue: assetValuation(data, period + periodGap),
        netWorth: netWorth(data, period + periodGap)
      },
      tenantData: {
        rent: rentBetweenPeriods(data, period - 1, period - 1 + periodGap),
        savings: savingsBetweenPeriods(data, period, period + periodGap),
        stockValue: stockValueInPeriod(data, period + periodGap),
        stockGain: stockGainBetweenPeriods(data, period, period + periodGap),
        tax: taxBetweenPeriods(data, period, period + periodGap)
      }
    }))
  )
  return {
    years: createPeriods(12),
    months: createPeriods(1)
  }
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* calculatePeriodsGenerator():any {
  const data = yield select(getTheData)
  try {
    const periodsObject = yield call(createPeriodsObject, data)
    yield put({type: CALCULATE_PERIODS_SUCCEEDED, value: periodsObject})
  } catch (e) {
    yield put({type: CALCULATE_PERIODS_FAILED, message: e.message})
  }
}
export function* calculatePeriodsSaga() {
  yield takeLatest(CALCULATE_PERIODS_REQUESTED, calculatePeriodsGenerator)
}
