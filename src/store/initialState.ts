import { theData } from '../helpers'
import { getTheData } from '../selectors'
import { createPeriodsObject } from '../sagas'
import memoize from 'memoizee'
const createDefaultPeriods = (data: theData) => createPeriodsObject(data)

const createDefaultRate = () => ({
  rate: 0.006200313537556212,
  status: 'done'
})

const defaultValues = {
  interestRate: 0.02 / 12,
  capGainsTax: 0.25,
  equity: 200000,
  rentPricePerSM: 14,
  buyPricePerSM: 4000,
  periods: 20 * 12,
  investmentReserve: 0.01 / 12,
  size: 100,
  brokerFee: 0.0714,
  notaryFee: 0.015,
  propertyPurchaseTax: 0.065,
  timeToDeath: 50 * 12,
  equityPriceIncrease: 0.02 / 12,
  rentIncreasePerPeriod: 0.02 / 12
}
const createDefaultForm = () => ({
  mainForm: {
    values: defaultValues
  }
})

const createInitialState = memoize (() => {
  const state = {
    equivalentRate: createDefaultRate(),
    data: defaultValues
  }
  return {
    app: {
      ...state,
      periods: createDefaultPeriods(getTheData({app: state}))
    },
    form: createDefaultForm()
  }
})

export default createInitialState
