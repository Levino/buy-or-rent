import { connect } from 'react-redux'

import * as React from 'react'
import { MoneyString } from './helperComponents'
import {
  Data,
  loanAmount, loanPaymentPerPeriod, PeriodsArray
} from './helpers'
import { selectors as resultSelectors } from './Result/redux'
import { State } from './store'
import { FormValues } from './store/initialState'

const { getResult } = resultSelectors

const createMoneyComponent = selector => connect(state => (
  { value: selector(state) }
))(
  MoneyString
)

const getLoanPaymentInFirstPeriod = state => getMonthlyLoanPayment(state, 0)

export const getMonthlyLoanPayment = (state, period: number) => {
  const data = getResult(state).data
  return loanPaymentPerPeriod(data, period)
}

export const LoanAmount = createMoneyComponent(state => loanAmount(getResult(state).data))

class RenderNumber extends React.Component<{ value: number }> {
  public render() {
    return `${this.props.value}`
  }
}

export const LoanYears = connect((state: State) => ({ value: getResult(state).data.loanData.periods / 12 }))(RenderNumber)

export const MonthlyLoanPayment = createMoneyComponent(getLoanPaymentInFirstPeriod)

export const getAnnualLoanPayment = state => 12 * getLoanPaymentInFirstPeriod(state)

export const AnnualLoanPayment = createMoneyComponent(getAnnualLoanPayment)

export const getAnnualInvestmentPayment = state => {
  const {
    investmentReserve,
  } = getResult(state).data.buyerData
  return 12 * investmentReserve * getNetPrice(state)
}

export const AnnualInvestmentPayment = createMoneyComponent(getAnnualInvestmentPayment)

const RenderPercent: React.FunctionComponent<{ value: number }> = ({ value }) => <React.Fragment>{`${(value * 100).toFixed(2)} %`}</React.Fragment>

const RenderSize = ({ value }): any => `${value} m²`

export const RentIncreasePerYear = connect(
  (state: State) => ({ value: getResult(state).data.rentData.rentIncreasePerPeriod * 12 })
)(RenderPercent)

export const PropertyValueIncreasePerYear =
  connect((state: State) => ({ value: getResult(state).data.buyerData.yieldPerPeriod * 12 }))(RenderPercent)

const getMonthlyInvestmentPayment = state => getAnnualInvestmentPayment(state) / 12

export const RentPerMonth = createMoneyComponent(state => {
  const {
    data: {
      rentData: {
        size,
        rentPricePerSM,
      },
    },
  } = getResult(state)
  return size * rentPricePerSM
})

export const MonthlyInvestmentPayment = createMoneyComponent(getMonthlyInvestmentPayment)

export const getNetPrice = (state) => {
  const {
    buyPricePerSM,
    size,
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
  getAnnualLoanPayment,
].reduce((acc, selector) => acc + selector(state), 0)

export const YearlyPaymentBuyer = createMoneyComponent(getYearlyPaymentBuyer)

const getMonthlyPaymentBuyer = state => getYearlyPaymentBuyer(state) / 12

export const MonthlyPaymentBuyer = createMoneyComponent(getMonthlyPaymentBuyer)

export const PropertySize = connect((state: State) => ({
  value: getResult(state).data.rentData.size,
}))(RenderSize)

export const getTotalPeriods = state => getResult(state).data.totalPeriods

const getEquity = state => getResult(state).data.buyerData.equity

export const YearsToDeath = connect((state: State) => ({ value: getResult(state).data.totalPeriods / 12 }))(RenderNumber)

export const Equity = createMoneyComponent(getEquity)

export const EquivalentRate = connect((state: State) => ({ value: getResult(state).data.stockData.stockIncreasePerPeriod * 12 }))
  (RenderPercent)

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

export const StockEndValue = createMoneyComponent(state => {
  const {
    data: {
      totalPeriods,
    },
    periods,
  } = getResult(state)
  return periods[totalPeriods].tenantData.stockValue
})

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
  rentIncreasePerPeriod,
}: FormValues, equivalentRate?: number): Data => {
  return {
    buyerData: {
      brokerFee,
      buyPricePerSM,
      equity,
      investmentReserve,
      notaryFee,
      propertyPurchaseTax,
      size,
      yieldPerPeriod: equityPriceIncrease,
    },
    loanData: {
      interestRate,
      periods,
    },
    rentData: {
      rentIncreasePerPeriod,
      rentPricePerSM,
      size,
    },
    stockData: {
      equity,
      stockIncreasePerPeriod: equivalentRate || 0,
    },
    taxData: {
      capGainsTax,
    },
    totalPeriods: timeToDeath,
  }
}

export const getPeriods = (state): PeriodsArray => getResult(state).periods
