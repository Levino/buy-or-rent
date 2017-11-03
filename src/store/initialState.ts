import {times} from 'lodash'

const createPeriods = (periodGap, periods) => (
  times(periods).map((period) => ({
    buyerData: {
      loanAmountAtBeginning: 0,
      loanPayment: 0,
      interestBetweenPeriods: 0,
      loanAmountAtEnd: 0,
      houseValue: 0,
      interest: 0
    },
    tenantData: {
      rent: 0,
      savings: 0,
      stockValue: 0,
      stockGain: 0,
      tax: 0
    },
    calculating: false
  }))
)
const createDefaultPeriods = () => ({
  years: createPeriods(12, 50),
  months: createPeriods(1, 600)
})

const createDefaultRate = () => ({
    rate: 0.1 / 12,
    status: 'done'
})

const createDefaultForm = () => ({
    mainForm: {
      values: {
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
    }
})

const createInitialState = () => ({
  periods: createDefaultPeriods(),
  equivalentRate: createDefaultRate(),
  form: createDefaultForm()
})

export default createInitialState
