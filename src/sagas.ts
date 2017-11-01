import { call, put, takeLatest, select } from 'redux-saga/effects'
import { getLoanData, getPropertyAssetData, getRentData, getStockData, getTaxData } from './selectors'
import { calculateEquivalentYield } from './helpers'

const EQUIVALENT_RATE_CALCULATION_SUCCEEDED = 'EQUIVALENT_RATE_CALCULATION_SUCCEEDED'
const EQUIVALENT_RATE_CALCULATION_FAILED = 'EQUIVALENT_RATE_CALCULATION_FAILED'
const EQUIVALENT_RATE_CALCULATION_REQUESTED = 'EQUIVALENT_RATE_CALCULATION_REQUESTED'

export const types = {
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_FAILED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* calculateEquivalentRateGenerator() {
  const state = yield select()
  const data = {
    assetData: getPropertyAssetData(state),
    taxData: getTaxData(state),
    loanData: getLoanData(state),
    stockData: getStockData(state),
    rentData: getRentData(state)
  }
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
function* calcRateSaga() {
  yield takeLatest(EQUIVALENT_RATE_CALCULATION_REQUESTED, calculateEquivalentRateGenerator)
}

export const actions = {
  calculateEquivYield() {
    return {
      type: EQUIVALENT_RATE_CALCULATION_REQUESTED
    }
  }
}

export default calcRateSaga
