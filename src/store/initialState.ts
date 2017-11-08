import memoize from 'memoizee'
import { dataFromFormValues } from '../selectors'
import { calculatePeriods } from '../helpers'

export type formValues = {
  interestRate: number
  capGainsTax: number
  equity: number
  rentPricePerSM: number
  buyPricePerSM: number
  periods: number
  investmentReserve: number
  size: number
  brokerFee: number
  notaryFee: number
  propertyPurchaseTax: number
  timeToDeath: number
  equityPriceIncrease: number
  rentIncreasePerPeriod: number
}
const defaultValues: formValues = {
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
  return {
    form: createDefaultForm(),
    calculating: false,
    result: {
      data: dataFromFormValues(defaultValues),
      periods: calculatePeriods(dataFromFormValues(defaultValues))
    }
  }
})

export default createInitialState
