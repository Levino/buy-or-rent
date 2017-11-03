import { call, put, select, takeLatest } from 'redux-saga/effects'
import { times } from 'lodash'
import { getTheData } from './selectors'
import {
  assetValuation, buyerPaymentsBetween, calculateEquivalentYield, interestBetween, netWorth,
  rentBetweenPeriods,
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
    yield call(calculatePeriodsGenerator)
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
export function* calcRateSaga(): any {
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

export const createPeriodsObject = (data: theData) => {
  const createPeriods = (periods, periodGap: number) => (
    times(periods).map(aPeriod => aPeriod * periodGap).map(period => ({
      buyerData: {
        loanAmountAtBeginning: restOfLoan(data, period),
        loanPayment: buyerPaymentsBetween(data, period, period + periodGap),
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
    years: createPeriods(data.loanData.totalPeriods / 12, 12),
    months: createPeriods(data.loanData.totalPeriods, 1)
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

export function* rootSaga () {
  yield takeLatest(CALCULATE_PERIODS_REQUESTED, calculatePeriodsGenerator),
  yield takeLatest(EQUIVALENT_RATE_CALCULATION_REQUESTED, calculateEquivalentRateGenerator)
}
