import {connect} from 'react-redux'

import {monthlyLoanPayment, moneyString } from './helpers'


const getSubState = state => state.form.mainForm.values

const createMoneyComponent = selector => connect(state => (
  { value: selector(state) }
))(
  ({value}) => moneyString(value)
)

export const getMonthlyLoanPayment = (state) => {
  const {
    periods,
    interestRate
  } = getSubState(state)
  const loan = getLoan(state)
  return monthlyLoanPayment({years: periods, interestRate: interestRate / 100, loan}).toFixed(2)
}

export const MonthlyLoanPayment = createMoneyComponent(getMonthlyLoanPayment)

export const annualLoanPayment = state => 12 * monthlyLoanPayment(state)

export const AnnualLoanPayment = createMoneyComponent(annualLoanPayment)

export const annualInvestmentPayment = state => {
  const {
    investmentReserve
  } = getSubState(state)
  return investmentReserve / 100 * netPrice(state)
}

export const AnnualInvestmentPayment = createMoneyComponent(annualInvestmentPayment)

export const netPrice = (state) => {
  const {
    buyPricePerSM,
    size
  } = getSubState(state)
  return buyPricePerSM * size
}

export const NetPrice = createMoneyComponent(netPrice)

export const grossPrice = (state) => {
  const {
    notaryFee,
    propertyPurchaseTax,
    brokerFee
  } = getSubState(state)
  return netPrice(state) * (1 + (notaryFee + brokerFee + propertyPurchaseTax) / 100)
}

export const GrossPrice = createMoneyComponent(grossPrice)

export const yearlyPaymentBuyer = state => [
  annualInvestmentPayment,
  annualLoanPayment
].reduce((acc, selector) => acc + selector(state), 0)

export const YearlyPaymentBuyer = createMoneyComponent(yearlyPaymentBuyer)

const getPeriods = state => getSubState(state).periods

const equity = state => getSubState(state).equity

const getLoan = state => grossPrice(state) - equity(state)

const getInterestRate = state => getSubState(state).interestRate

export const loanPayments = state => {
  const yearlyLoanPayment = yearlyPaymentBuyer(state)
  const periods = getPeriods(state)
  let loanAtBeginning = getLoan(state)
  return [...Array(periods).keys()].map((value, period) => {
    const loanAtEnd = loanAtBeginning - yearlyLoanPayment
    const interest = getInterestRate(state) / 100 * loanAtBeginning
    const result = {
      year: 2018 + period,
      loanAtBeginning,
      loanPayment: annualLoanPayment(state),
      interest,
      loanAtEnd
    }
    loanAtBeginning = loanAtEnd + interest
    return result
  })
}
