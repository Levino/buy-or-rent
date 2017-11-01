import { times } from 'lodash'
import * as memoize from 'memoizee'
import memProfile from 'memoizee/profile'

(<any> window).memProfile = memProfile

export const PMT = memoize((rate, nper, pv, fv = 0, type = 0) => {
  if (rate === 0) {
    return -(pv + fv) / nper
  }

  const pvif = Math.pow(1 + rate, nper)
  let pmt = rate / (pvif - 1) * -(pv * pvif + fv)

  if (type === 1) {
    pmt /= (1 + rate)
  }
  return pmt
})

export const loanPaymentPerPeriod = ({interestRate, loanAmount, periods}: loanDataType) => (
  -1 * PMT(interestRate, periods, loanAmount)
)

const roundMoney = value => Math.round(value * 100) / 100

export const loanPayments = ({interestRate, loan, periods}) => {
  let loanAtBeginningOfYear = loan
  let loanAtEndOfYear
  const amountMonthlyLoanPayment = loanPaymentPerPeriod({interestRate, loanAmount: loan, periods})
  return times(periods).map(year => {
    let loanAtBeginningOfMonth = loanAtBeginningOfYear
    let loanAtEndOfMonth
    let yearlyInterest = 0
    const monthlyPayments = times(12).map(() => {
      const interest = loanAtBeginningOfMonth * interestRate / 12
      yearlyInterest += interest
      loanAtEndOfMonth = loanAtBeginningOfMonth - amountMonthlyLoanPayment + interest
      const otherResult = {
        loanAtBeginning: loanAtBeginningOfMonth,
        loanAtEnd: loanAtEndOfMonth
      }
      loanAtBeginningOfMonth = loanAtEndOfMonth
      return otherResult
    })
    loanAtEndOfYear = monthlyPayments[11].loanAtEnd
    const result = {
      year: 2018 + year,
      loanAtBeginning: roundMoney(loanAtBeginningOfYear),
      loanPayment: roundMoney(amountMonthlyLoanPayment * 12),
      loanAtEnd: roundMoney(loanAtEndOfYear),
      interest: yearlyInterest,
      monthlyPayments
    }
    loanAtBeginningOfYear = loanAtEndOfYear
    return result
  })
}

const valueOfPropertyByYear = ({valueAtBeginning, periods, gainPerPeriod}) => {
  return times(periods).map((period) => (
    {
      year: 2018 + period,
      value: valueAtBeginning * Math.pow((1 + gainPerPeriod), period)
    }
  ))
}

export const buyerValues = ({
                              interestRate,
                              loan,
                              repaymentPeriods,
                              timeToDeath,
                              transactionCost,
                              timeBetweenTransactions,
                              valueAtBeginning,
                              equityPriceIncrease
                            }) => {
  const loanPaymentsArray = loanPayments({interestRate, loan, periods: repaymentPeriods})
  const valueOfPropertyByYearArray = valueOfPropertyByYear({
    valueAtBeginning,
    periods: timeToDeath,
    gainPerPeriod: equityPriceIncrease
  })
  return valueOfPropertyByYearArray.map(({year, value}, index) => ({
    year,
    valueOfProperty: value,
    ...loanPaymentsArray[index],
    networth: value - (loanPaymentsArray[index] ? loanPaymentsArray[index].loanAtEnd : 0)
  }))
}

const yearlyStockValues = ({stockValueAtBeginning, monthlyRate, interestRate}) => {
  const reducer = ({
                     stockGain,
                     stockValue
                   }) => {
    const stockGainThisMonth = stockValue * interestRate / 12
    return {
      stockGain: stockGain + stockGainThisMonth,
      stockValue: stockValue + stockGainThisMonth + monthlyRate
    }
  }
  const startValue = {stockGain: 0, stockValue: stockValueAtBeginning}
  return times(12).reduce(reducer, startValue)
}
const tenantValues = ({
                        yearlyRentIncrease,
                        rentAtBeginning,
                        periods,
                        stockValueAtBeginning,
                        monthlyPaymentPhase1,
                        monthlyPaymentPhase2,
                        equivalentRate,
                        phase1Periods
                      }) => {
  let stockValue = stockValueAtBeginning
  return times(periods).map(period => {
    const yearlyRent = rentAtBeginning * Math.pow((1 + yearlyRentIncrease), period)
    const monthlyRent = yearlyRent / 12
    let monthlyInvestment
    if (period < phase1Periods) {
      monthlyInvestment = monthlyPaymentPhase1 - monthlyRent
    } else {
      monthlyInvestment = monthlyPaymentPhase2 - monthlyRent
    }
    const yearlyStockValuesObject = yearlyStockValues({
      stockValueAtBeginning: stockValue,
      monthlyRate: monthlyInvestment,
      interestRate: equivalentRate
    })
    const result = {
      year: 2018 + period,
      yearlyRent,
      monthlyRent,
      ...yearlyStockValuesObject,
      yearlyInvestment: monthlyInvestment * 12
    }
    stockValue = yearlyStockValuesObject.stockValue
    return result
  })
}

export const allValues = ({
                            interestRate,
                            loan,
                            repaymentPeriods,
                            timeToDeath,
                            transactionCost,
                            timeBetweenTransactions,
                            valueAtBeginning,
                            equityPriceIncrease,
                            rentAtBeginning,
                            yearlyRentIncrease,
                            equivalentRate,
                            equity,
                            monthlyPaymentRepayment,
                            monthlyPaymentAfterRepayment
                          }) => {

  const tenantValuesArray = tenantValues({
    yearlyRentIncrease,
    rentAtBeginning,
    periods: timeToDeath,
    monthlyPaymentPhase1: monthlyPaymentRepayment,
    monthlyPaymentPhase2: monthlyPaymentAfterRepayment,
    phase1Periods: repaymentPeriods,
    equivalentRate,
    stockValueAtBeginning: equity
  })
  const buyerValuesArray = buyerValues({
    interestRate,
    loan,
    repaymentPeriods,
    timeToDeath,
    transactionCost,
    timeBetweenTransactions,
    valueAtBeginning,
    equityPriceIncrease
  })
  return buyerValuesArray.map((value, index) => ({
    ...value,
    ...tenantValuesArray[index]
  }))
}

export const sum = (from: number, to: number, fn: (i: number) => number): number => {
  return times(to - from + 1, (value) => value + from).reduce((acc, value) => acc + fn(value), 0)
}

const amountAtEndOfPeriod = (amountAtBeginning: number, interestRate: number, paymentPerPeriod: number): number => amountAtBeginning * (1 + interestRate) + paymentPerPeriod

export type loanDataType = {
  periods: number
  loanAmount: number
  interestRate: number
}

export const restOfLoan = memoize((loanData: loanDataType,
                                   period: number): number => {
  const {
    loanAmount,
    interestRate,
    periods
  } = loanData
  const paymentPerPeriod = PMT(interestRate, periods, loanAmount)
  if (period === 0) {
    return loanAmount
  }
  return amountAtEndOfPeriod(restOfLoan(loanData, period - 1), interestRate, paymentPerPeriod)
})

export type AssetData = {
  equity: number
  yieldPerPeriod: number
}

export const assetValuation = memoize((assetData: AssetData, period: number): number => {
  const {
    equity,
    yieldPerPeriod
  } = assetData
  if (period === 0) {
    return equity
  }
  return assetValuation(assetData, period - 1) * (1 + yieldPerPeriod)
})

export const interestBetween = memoize((loanData: loanDataType, fromPeriod: number, toPeriod: number): number => {
  if (toPeriod < 1) {
    throw new Error('To period cannot be below 1')
  }
  if (toPeriod - fromPeriod === 1) {
    return restOfLoan(loanData, fromPeriod) * loanData.interestRate
  }
  return interestBetween(loanData, fromPeriod, toPeriod - 1)
    + restOfLoan(loanData, toPeriod - 1) * loanData.interestRate
})

export const netWorth = (loanData: loanDataType, assetData: AssetData, period: number): number => {
  return assetValuation(assetData, period) - restOfLoan(loanData, period)
}

export type RentData = {
  size: number,
  rentPricePerSM: number,
  rentIncreasePerPeriod: number
}

const rentInPeriod = memoize((rentData: RentData, period) => {
  if (period === 0) {
    return rentData.rentPricePerSM * rentData.size
  }
  return rentInPeriod(rentData, period - 1) * (1 + rentData.rentIncreasePerPeriod)
})

export const rentBetweenPeriods = memoize((rentData: RentData, fromPeriod: number, toPeriod: number) => {
  if ((toPeriod - fromPeriod) === 1) {
    return rentInPeriod(rentData, fromPeriod)
  }
  return rentBetweenPeriods(rentData, fromPeriod, toPeriod - 1) + rentInPeriod(rentData, toPeriod)
})

const savingsPerPeriod = memoize((rentData: RentData, loanData: loanDataType, period: number): number => {
  return loanPaymentPerPeriod(loanData) - rentInPeriod(rentData, period)
})

export const savingsBetweenPeriods = memoize(
  (rentData: RentData,
   loanData: loanDataType,
   fromPeriod: number,
   toPeriod: number): number => {
    if ((toPeriod - fromPeriod) === 1) {
      return savingsPerPeriod(rentData, loanData, fromPeriod)
    }
    return savingsBetweenPeriods(
      rentData,
      loanData,
      fromPeriod,
      toPeriod - 1) +
      savingsPerPeriod(rentData, loanData, toPeriod)
  }
)

export type StockData = {
  equity: number
}

export type TaxData = {
  capGainsTax: number
}

export const stockValueInPeriod = memoize(
  (stockData: StockData,
   rentData: RentData,
   loanData: loanDataType,
   taxData: TaxData,
   stockIncreasePerPeriod: number,
   period: number): number => {
    if (period < 0) {
      throw new Error('period cannot be negative!')
    }
    if (period === 0) {
      return stockData.equity
    }
    return stockValueInPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, period - 1)
      * (1 + (stockIncreasePerPeriod * (1 - taxData.capGainsTax)))
      + savingsPerPeriod(rentData, loanData, period)
  })

const stockGainInPeriod = memoize((stockData: StockData,
                                   rentData: RentData,
                                   loanData: loanDataType,
                                   taxData: TaxData,
                                   stockIncreasePerPeriod: number,
                                   period: number) => {
  if (period === 0) {
    return stockData.equity * stockIncreasePerPeriod
  }
  return stockValueInPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, period - 1)
    * stockIncreasePerPeriod
})

export const stockGainBetweenPeriods = memoize((stockData: StockData,
                                                rentData: RentData,
                                                loanData: loanDataType,
                                                taxData: TaxData,
                                                stockIncreasePerPeriod: number,
                                                fromPeriod: number,
                                                toPeriod: number) => {
  if ((toPeriod - fromPeriod) === 1) {
    return stockGainInPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, toPeriod)
  }
  return stockGainBetweenPeriods(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, fromPeriod, toPeriod - 1)
    + stockGainInPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, toPeriod)
})

const taxPerPeriod = memoize(((stockData: StockData,
                               rentData: RentData,
                               loanData: loanDataType,
                               taxData: TaxData,
                               stockIncreasePerPeriod: number,
                               period: number) => {
  return stockGainInPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, period) * taxData.capGainsTax
}))

export const taxBetweenPeriods = memoize((
  stockData: StockData,
  rentData: RentData,
  loanData: loanDataType,
  taxData: TaxData,
  stockIncreasePerPeriod: number,
  fromPeriod: number,
  toPeriod: number) => {
  if (!(toPeriod > fromPeriod)) {
    throw new Error('toPeriod needs to be larger than fromPeriod')
  }
  if ((toPeriod - fromPeriod) === 1) {
    return taxPerPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, fromPeriod)
  }
  return taxBetweenPeriods(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, fromPeriod, toPeriod - 1)
    + taxPerPeriod(stockData, rentData, loanData, taxData, stockIncreasePerPeriod, toPeriod - 1)
})

type CalcEquivalentRateType = {
  stockData: StockData
  rentData: RentData,
  loanData: loanDataType,
  taxData: TaxData,
  assetData: AssetData,
  period: number
}
export const calculateEquivalentYield = async ({
  stockData,
  rentData,
  loanData,
  taxData,
  assetData,
  period}: CalcEquivalentRateType) => {
  let upperLimit = 0.2
  let lowerLimit = 0
  let error = 1
  let approximationValue
  let safety = 0

  const iteration = async () => {
    return new Promise((resolve, reject) => {
      approximationValue = (upperLimit + lowerLimit) / 2
      const netWorthBuyer = netWorth(loanData, assetData, period)
      const netWorthTenant = stockValueInPeriod(stockData, rentData, loanData, taxData, approximationValue, period)
      error = netWorthTenant - netWorthBuyer
      if (error > 0) {
        upperLimit = approximationValue
      } else {
        lowerLimit = approximationValue
      }
      ++safety
      if (safety > 10000) {
        return reject('Approximation failed!')
      }
      resolve()
    })
  }

  do {
    await iteration()
  } while (Math.abs(error) > 0.001)
  return approximationValue
}
