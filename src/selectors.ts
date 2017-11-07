import { connect } from 'react-redux'

import {
  loanPaymentPerPeriod, loanDataType, AssetData, RentData,
  StockData, TaxData, theData
} from './helpers'
import { MoneyString } from './helperComponents'
import { getEquivalentRate } from './reducers'
import { TenantRowInterface } from './DetailsTables/TenantRow'
import { BuyerRowInterface } from './DetailsTables/BuyerRow'

const getSubState = state => state.app.data

const createMoneyComponent = selector => connect(state => (
  {value: selector(state)}
))(
  MoneyString
)

const getLoanPaymentInFirstPeriod = state => getMonthlyLoanPayment(state, 0)

export const getMonthlyLoanPayment = (state, period: number) => {
  const data = getTheData(state)
  return loanPaymentPerPeriod(data, period)
}

export const LoanAmount = createMoneyComponent(state => getTheData(state).loanData.loanAmount)

export const LoanYears = connect(state => ({years: getTheData(state).loanData.periods / 12}))(({years}) => years)

export const MonthlyLoanPayment = createMoneyComponent(getLoanPaymentInFirstPeriod)

export const getAnnualLoanPayment = state => 12 * getLoanPaymentInFirstPeriod(state)

export const AnnualLoanPayment = createMoneyComponent(getAnnualLoanPayment)

export const getAnnualInvestmentPayment = state => {
  const {
    investmentReserve
  } = getSubState(state)
  return 12 * investmentReserve * getNetPrice(state)
}

export const AnnualInvestmentPayment = createMoneyComponent(getAnnualInvestmentPayment)

export const PropertyValueIncreasePerYear = connect(state => ({value: getTheData(state).assetData.yieldPerPeriod * 12}))(({value}) => `${value * 100} %`)

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

export const PropertyEndValue = createMoneyComponent(state => state.app.periods.values[state.app.periods.totalPeriods].buyerData.propertyValue)

export const GrossPrice = createMoneyComponent(grossPrice)

export const getYearlyPaymentBuyer = state => [
  getAnnualInvestmentPayment,
  getAnnualLoanPayment
].reduce((acc, selector) => acc + selector(state), 0)

export const YearlyPaymentBuyer = createMoneyComponent(getYearlyPaymentBuyer)

const getMonthlyPaymentBuyer = state => getYearlyPaymentBuyer(state) / 12

export const MonthlyPaymentBuyer = createMoneyComponent(getMonthlyPaymentBuyer)

export const PropertySize = connect(state => ({
  size: getTheData(state).rentData.size
}))(({size}) => `${size} m²`)

export const getTotalPeriods = state => state.app.periods.totalPeriods

const getEquity = state => getSubState(state).equity

export const YearsToDeath = connect(state => ({value: getTheData(state).loanData.totalPeriods}))(({value}) => `${value / 12}`)

export const Equity = createMoneyComponent(getEquity)

export const getLoan = state => grossPrice(state) - getEquity(state)

export const Loan = createMoneyComponent(getLoan)

const getEquityPriceIncrease = state => getSubState(state).equityPriceIncrease

const getBrokerFee = state => getSubState(state).brokerFee

const getAbsoluteBrokerFee = (state) => {
  const brokerFee = getBrokerFee(state)
  const netPrice = getNetPrice(state)
  return brokerFee * netPrice
}

export const AbsoluteBrokerFee = createMoneyComponent(getAbsoluteBrokerFee)

const getPropertyPurchaseTaxRate = state => getSubState(state).propertyPurchaseTax

const getAbsolutePropertyPurchaseTax = state => {
  const propertyPurchaseTaxRate = getPropertyPurchaseTaxRate(state)
  const netPrice = getNetPrice(state)
  return netPrice * propertyPurchaseTaxRate
}

export const AbsolutePropertyPurchaseTax = createMoneyComponent(getAbsolutePropertyPurchaseTax)

const getNotaryFee = state => getSubState(state).notaryFee

const getAbsoluteNotaryFee = state => {
  const netPrice = getNetPrice(state)
  const notaryFee = getNotaryFee(state)
  return notaryFee * netPrice
}

export const AbsoluteNotaryFee = createMoneyComponent(getAbsoluteNotaryFee)

export const getLoanData = (state): loanDataType => {
  const loanAmount = getLoan(state)
  const {interestRate, periods} = getSubState(state)
  const totalPeriods = getSubState(state).timeToDeath
  return {
    loanAmount,
    interestRate,
    periods,
    totalPeriods
  }
}

export const getPropertyAssetData = (state): AssetData => {
  const equity = getNetPrice(state)
  const yieldPerPeriod = getEquityPriceIncrease(state)
  const {
    investmentReserve
  } = getSubState(state)
  return {
    equity,
    yieldPerPeriod,
    investmentReserve
  }
}

export const getRentData = (state: any): RentData => {
  const subState = getSubState(state)
  const {
    rentPricePerSM,
    rentIncreasePerPeriod,
    size
  } = subState
  return {
    rentIncreasePerPeriod,
    rentPricePerSM,
    size
  }
}
export const getStockData = (state: any): StockData => {
  const subState = getSubState(state)
  const {
    equity
  } = subState
  return {
    equity,
    stockIncreasePerPeriod: getEquivalentRate(state)
  }
}

export const getTaxData = (state: any): TaxData => {
  const subState = getSubState(state)
  const {
    capGainsTax
  } = subState
  return {
    capGainsTax
  }
}

export const getTheData = (state): theData => ({
  taxData: getTaxData(state),
  stockData: getStockData(state),
  rentData: getRentData(state),
  assetData: getPropertyAssetData(state),
  loanData: getLoanData(state)
})

type period = {
  buyerData: BuyerRowInterface,
  tenantData: TenantRowInterface
}

type periodsObject = {
  months: [period]
  years: [period]
}

export const getPeriods = (state): periodsObject => state.app.periods.values
