import { connect } from 'react-redux'

import {
  loanAmount,
  loanPaymentPerPeriod, PeriodsArray, theData
} from './helpers'
import { MoneyString } from './helperComponents'
import { Component } from 'react'
import { selectors as resultSelectors } from './Result/redux'
import { formValues } from './store/initialState'

const { getResult } = resultSelectors

const createMoneyComponent = selector => connect(state => (
  {value: selector(state)}
))(
  MoneyString
)

const getLoanPaymentInFirstPeriod = state => getMonthlyLoanPayment(state, 0)

export const getMonthlyLoanPayment = (state, period: number) => {
  const data = getResult(state).data
  return loanPaymentPerPeriod(data, period)
}

export const LoanAmount = createMoneyComponent(state => loanAmount(getResult(state).data))

class RenderNumber extends Component<{ value: number }> {
  render() {
    return `${this.props.value}`
  }
}

export const LoanYears = connect(state => ({value: getResult(state).data.loanData.periods / 12}))(RenderNumber)

export const MonthlyLoanPayment = createMoneyComponent(getLoanPaymentInFirstPeriod)

export const getAnnualLoanPayment = state => 12 * getLoanPaymentInFirstPeriod(state)

export const AnnualLoanPayment = createMoneyComponent(getAnnualLoanPayment)

export const getAnnualInvestmentPayment = state => {
  const {
    investmentReserve
  } = getResult(state).data.buyerData
  return 12 * investmentReserve * getNetPrice(state)
}

export const AnnualInvestmentPayment = createMoneyComponent(getAnnualInvestmentPayment)

class RenderPercent extends Component<{ value: number }> {
  render() {
    return `${this.props.value * 100} %`
  }
}

class RenderSize extends Component<{ value: number }> {
  render() {
    return `${this.props.value} m²`
  }
}

export const PropertyValueIncreasePerYear =
  connect(state => ({value: getResult(state).data.buyerData.yieldPerPeriod * 12}))(RenderPercent)

const getMonthlyInvestmentPayment = state => getAnnualInvestmentPayment(state) / 12

export const MonthlyInvestmentPayment = createMoneyComponent(getMonthlyInvestmentPayment)

export const getNetPrice = (state) => {
  const {
    buyPricePerSM,
    size
  } = getResult(state).data.buyerData
  return buyPricePerSM * size
}

export const NetPrice = createMoneyComponent(getNetPrice)

export const grossPrice = (state) => {
  const notaryFee = getAbsoluteNotaryFee(state)
  const propertyPurchaseTax = getAbsolutePropertyPurchaseTax(state)
  const brokerFee = getAbsoluteBrokerFee(state)
  return getNetPrice(state) + notaryFee + propertyPurchaseTax + brokerFee
}

export const PropertyEndValue = createMoneyComponent(state => getResult(state).periods[getResult(state).data.totalPeriods].buyerData.propertyValue)

export const GrossPrice = createMoneyComponent(grossPrice)

export const getYearlyPaymentBuyer = state => [
  getAnnualInvestmentPayment,
  getAnnualLoanPayment
].reduce((acc, selector) => acc + selector(state), 0)

export const YearlyPaymentBuyer = createMoneyComponent(getYearlyPaymentBuyer)

const getMonthlyPaymentBuyer = state => getYearlyPaymentBuyer(state) / 12

export const MonthlyPaymentBuyer = createMoneyComponent(getMonthlyPaymentBuyer)

export const PropertySize = connect(state => ({
  value: getResult(state).data.rentData.size
}))(RenderSize)

export const getTotalPeriods = state => getResult(state).data.totalPeriods

const getEquity = state => getResult(state).data.buyerData.equity

export const YearsToDeath = connect(state => ({value: getResult(state).data.totalPeriods / 12}))(RenderNumber)

export const Equity = createMoneyComponent(getEquity)

export const getLoan = state => grossPrice(state) - getEquity(state)

export const Loan = createMoneyComponent(getLoan)

const getBrokerFee = state => getResult(state).data.buyerData.brokerFee

const getAbsoluteBrokerFee = (state) => {
  const brokerFee = getBrokerFee(state)
  const netPrice = getNetPrice(state)
  return brokerFee * netPrice
}

export const AbsoluteBrokerFee = createMoneyComponent(getAbsoluteBrokerFee)

const getPropertyPurchaseTaxRate = state => getResult(state).data.buyerData.propertyPurchaseTax

const getAbsolutePropertyPurchaseTax = state => {
  const propertyPurchaseTaxRate = getPropertyPurchaseTaxRate(state)
  const netPrice = getNetPrice(state)
  return netPrice * propertyPurchaseTaxRate
}

export const AbsolutePropertyPurchaseTax = createMoneyComponent(getAbsolutePropertyPurchaseTax)

const getNotaryFee = state => getResult(state).data.buyerData.notaryFee

const getAbsoluteNotaryFee = state => {
  const netPrice = getNetPrice(state)
  const notaryFee = getNotaryFee(state)
  return notaryFee * netPrice
}

export const AbsoluteNotaryFee = createMoneyComponent(getAbsoluteNotaryFee)

export const dataFromFormValues = ({
                                     interestRate,
                                     capGainsTax,
                                     equity,
                                     rentPricePerSM,
                                     buyPricePerSM,
                                     periods,
                                     investmentReserve,
                                     size,
                                     brokerFee,
                                     notaryFee,
                                     propertyPurchaseTax,
                                     timeToDeath,
                                     equityPriceIncrease,
                                     rentIncreasePerPeriod
                           }: formValues): theData => {
  return {
    taxData: {
      capGainsTax
    },
    stockData: {
      equity,
      stockIncreasePerPeriod: 0
    },
    rentData: {
      rentPricePerSM,
        rentIncreasePerPeriod,
        size
    },
    buyerData: {
      buyPricePerSM,
      size,
      brokerFee,
      notaryFee,
      propertyPurchaseTax,
      yieldPerPeriod: equityPriceIncrease,
      investmentReserve,
      equity
    },
    loanData: {
      periods,
      interestRate
    },
    totalPeriods: timeToDeath
  }
}

export const getPeriods = (state): PeriodsArray => getResult(state).periods
