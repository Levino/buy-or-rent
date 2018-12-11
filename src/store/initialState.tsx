import * as memoize from 'memoizee'
import { State } from '.'
import { calculatePeriods } from '../helpers'
import { dataFromFormValues } from '../selectors'

export interface FormValues {
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
const defaultValues: FormValues = {
  brokerFee: 0.0714,
  buyPricePerSM: 4000,
  capGainsTax: 0.25,
  equity: 200000,
  equityPriceIncrease: 0.02 / 12,
  interestRate: 0.02 / 12,
  investmentReserve: 0.01 / 12,
  notaryFee: 0.015,
  periods: 20 * 12,
  propertyPurchaseTax: 0.065,
  rentIncreasePerPeriod: 0.02 / 12,
  rentPricePerSM: 14,
  size: 100,
  timeToDeath: 50 * 12,
}

export interface Form {
  mainForm: {
    values: FormValues
  }
}
const createDefaultForm = (): Form => ({
  mainForm: {
    values: defaultValues,
  },
})

const createInitialState: () => State = memoize(() => {
  return {
    calculating: false,
    form: createDefaultForm(),
    result: {
      data: dataFromFormValues(defaultValues, 0.006200313536586084),
      periods: calculatePeriods(
        dataFromFormValues(defaultValues, 0.006200313536586084)
      ),
    },
  }
})

export default createInitialState
