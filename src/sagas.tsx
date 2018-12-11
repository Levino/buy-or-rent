import { call, put, takeLatest } from 'redux-saga/effects'
import { calculateEquivalentYield, calculatePeriods, Data } from './helpers'
import { dataFromFormValues } from './selectors'

import { actions as resultActions } from './Result/redux'

const { saveResult } = resultActions

const EQUIVALENT_RATE_CALCULATION_SUCCEEDED =
  'EQUIVALENT_RATE_CALCULATION_SUCCEEDED'
const EQUIVALENT_RATE_CALCULATION_FAILED = 'EQUIVALENT_RATE_CALCULATION_FAILED'
const EQUIVALENT_RATE_CALCULATION_REQUESTED =
  'EQUIVALENT_RATE_CALCULATION_REQUESTED'
const CALCULATE_PERIODS_REQUESTED = 'CALCULATE_PERIODS_REQUESTED'
const CALCULATE_PERIODS_FAILED = 'CALCULATE_PERIODS_FAILED'
const CALCULATE_PERIODS_SUCCEEDED = 'CALCULATE_PERIODS_SUCCEEDED'

export const types = {
  CALCULATE_PERIODS_FAILED,
  CALCULATE_PERIODS_REQUESTED,
  CALCULATE_PERIODS_SUCCEEDED,
  EQUIVALENT_RATE_CALCULATION_FAILED,
  EQUIVALENT_RATE_CALCULATION_REQUESTED,
  EQUIVALENT_RATE_CALCULATION_SUCCEEDED,
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* calculateEquivalentRateGenerator({ values }: any): any {
  const data = dataFromFormValues(values)
  console.log(values)
  try {
    const stockIncreasePerPeriod = yield call(calculateEquivalentYield, data)
    yield put({ type: EQUIVALENT_RATE_CALCULATION_SUCCEEDED })
    const result = yield call(createResultObject, {
      ...data,
      stockData: {
        ...data.stockData,
        stockIncreasePerPeriod,
      },
    })
    yield put(saveResult(result))
  } catch (e) {
    yield put({ type: EQUIVALENT_RATE_CALCULATION_FAILED, message: e.message })
  }
}

export const actions = {
  calculateEquivYield(values: any) {
    return {
      type: EQUIVALENT_RATE_CALCULATION_REQUESTED,
      values,
    }
  },
}

export const createResultObject = (data: Data) => ({
  data,
  periods: calculatePeriods(data),
})

export function* rootSaga() {
  yield takeLatest(
    EQUIVALENT_RATE_CALCULATION_REQUESTED,
    calculateEquivalentRateGenerator
  )
}
