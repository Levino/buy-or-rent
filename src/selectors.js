import {connect} from 'react-redux'

import {monthlyLoanPayment, moneyString, loanPayments} from './helpers'


const getSubState = state => state.form.mainForm.values

const createMoneyComponent = selector => connect(state => (
  { value: selector(state) }
))(
  ({value}) => moneyString(value)
)

export const getMonthlyLoanPayment = (state) => {
  const periods = getPeriods(state)
  const interestRate = getInterestRate(state)
  const loan = getLoan(state)
  return monthlyLoanPayment({years: periods, interestRate, loan})
}

export const MonthlyLoanPayment = createMoneyComponent(getMonthlyLoanPayment)

export const getAnnualLoanPayment = state => 12 * getMonthlyLoanPayment(state)

export const AnnualLoanPayment = createMoneyComponent(getAnnualLoanPayment)

export const getAnnualInvestmentPayment = state => {
  const {
    investmentReserve
  } = getSubState(state)
  return investmentReserve / 100 * getNetPrice(state)
}

export const AnnualInvestmentPayment = createMoneyComponent(getAnnualInvestmentPayment)

const getMonthlyInvestmentPayment = state => getAnnualInvestmentPayment(state) / 12

export const MonthlyInvestmentPayment = createMoneyComponent(getMonthlyInvestmentPayment)

export const getNetPrice = (state) => {
  const {
    buyPricePerSM,
    size
  } = getSubState(state)
  return buyPricePerSM * size
}

export const NetPrice = createMoneyComponent(getNetPrice)

export const grossPrice = (state) => {
  const notaryFee = getAbsoluteNotaryFee(state)
  const propertyPurchaseTax = getAbsolutePropertyPurchaseTax(state)
  const brokerFee = getAbsoluteBrokerFee(state)
  return getNetPrice(state) + notaryFee + propertyPurchaseTax + brokerFee
}

export const GrossPrice = createMoneyComponent(grossPrice)

export const getYearlyPaymentBuyer = state => [
  getAnnualInvestmentPayment,
  getAnnualLoanPayment
].reduce((acc, selector) => acc + selector(state), 0)

export const YearlyPaymentBuyer = createMoneyComponent(getYearlyPaymentBuyer)

const getMonthlyPaymentBuyer = state => getYearlyPaymentBuyer(state) / 12

export const MonthlyPaymentBuyer = createMoneyComponent(getMonthlyPaymentBuyer)

const getPeriods = state => getSubState(state).periods

const getEquity = state => getSubState(state).equity

export const Equity = createMoneyComponent(getEquity)

const getLoan = state => grossPrice(state) - getEquity(state)

export const Loan = createMoneyComponent(getLoan)

const getInterestRate = state => getSubState(state).interestRate / 100

export const getLoanPayments = state => {
  const periods = getPeriods(state)
  const interestRate = getInterestRate(state)
  const loan = getLoan(state)
  return loanPayments({years: periods, interestRate, loan})
}

const getBrokerFee = state => getSubState(state).brokerFee / 100

const getAbsoluteBrokerFee = (state) => {
  const brokerFee = getBrokerFee(state)
  const netPrice = getNetPrice(state)
  return brokerFee * netPrice
}

export const AbsoluteBrokerFee = createMoneyComponent(getAbsoluteBrokerFee)

const getPropertyPurchaseTaxRate = state => getSubState(state).propertyPurchaseTax / 100

const getAbsolutePropertyPurchaseTax = state => {
  const propertyPurchaseTaxRate = getPropertyPurchaseTaxRate(state)
  const netPrice = getNetPrice(state)
  return netPrice * propertyPurchaseTaxRate
}

export const AbsolutePropertyPurchaseTax = createMoneyComponent(getAbsolutePropertyPurchaseTax)

const getNotaryFee = state => getSubState(state).notaryFee / 100

const getAbsoluteNotaryFee = state => {
  const netPrice = getNetPrice(state)
  const notaryFee = getNotaryFee(state)
  return notaryFee * netPrice
}

export const AbsoluteNotaryFee = createMoneyComponent(getAbsoluteNotaryFee)
