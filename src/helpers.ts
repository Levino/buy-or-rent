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

type loanPaymentPerPeriodInterface = {
  interestRate: number
  loan: number
  periods: number
}

export const loanPaymentPerPeriod = ({interestRate, loan, periods}: loanPaymentPerPeriodInterface) => (
  -1 * PMT(interestRate, periods, loan)
)

const roundMoney = value => Math.round(value * 100) / 100

export const loanPayments = ({interestRate, loan, periods}) => {
  let loanAtBeginningOfYear = loan
  let loanAtEndOfYear
  const amountMonthlyLoanPayment = loanPaymentPerPeriod({interestRate, loan, periods})
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
                              equityPriceIncrease}) => {
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
                        phase1Periods}) => {
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

export const calculateEquivalentRate = ({
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
                                          equity,
                                          monthlyPaymentRepayment,
                                          monthlyPaymentAfterRepayment
                                        }) => {
  let upperBoundary = 1
  let lowerBoundary = 0
  const allValuesForRate = (equivalentRateTwo) => allValues({
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
    equity,
    monthlyPaymentRepayment,
    monthlyPaymentAfterRepayment,
    equivalentRate: equivalentRateTwo
  })
  const error = (allValuesArray) => {
    const {networth, stockValue} = allValuesArray[timeToDeath]
    return Math.abs(networth - stockValue)
  }
  let equivalentRate = 0.5
  let lastAllValuesArray = allValuesForRate(equivalentRate)
  while (Math.abs(error(lastAllValuesArray)) >= 100) {
    if (error(lastAllValuesArray) < 0) {
      upperBoundary = (lowerBoundary + upperBoundary) / 2
    } else {
      lowerBoundary = (upperBoundary + lowerBoundary) / 2
    }
    equivalentRate = (lowerBoundary + upperBoundary) / 2
    lastAllValuesArray = allValuesForRate(equivalentRate)
  }
  return equivalentRate
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

export interface IassetData {
  equity: number
  yieldPerPeriod: number
}

export const assetValuation = memoize((assetData: IassetData, period: number): number => {
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

export const netWorth = (loanData: loanDataType, assetData: IassetData, period: number): number => {
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
  return rentInPeriod(rentData, period - 1)  * (1 + rentData.rentIncreasePerPeriod)
})

export const rentBetweenPeriods = memoize((rentData: RentData, fromPeriod: number, toPeriod: number) => {
  if ((toPeriod - fromPeriod) === 1) {
    return rentInPeriod(rentData, fromPeriod)
  }
  return rentBetweenPeriods(rentData, fromPeriod, toPeriod -1 ) + rentInPeriod(rentData, toPeriod)
})
