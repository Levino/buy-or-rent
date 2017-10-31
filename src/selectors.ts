import { connect } from 'react-redux'

import { loanPaymentPerPeriod, allValues, calculateEquivalentRate, loanDataType, IassetData } from './helpers'
import { MoneyString } from './helperComponents'
import { getEquivalentRate } from './equivalentRate'

const getSubState = state => state.form.mainForm.values

const createMoneyComponent = selector => connect(state => (
    {value: selector(state)}
))(
    MoneyString
)

export const getMonthlyLoanPayment = (state) => {
    const periods = getPeriods(state)
    const interestRate = getInterestRate(state)
    const loan = getLoan(state)
    return loanPaymentPerPeriod({periods, interestRate, loan})
}

export const MonthlyLoanPayment = createMoneyComponent(getMonthlyLoanPayment)

export const getAnnualLoanPayment = state => 12 * getMonthlyLoanPayment(state)

export const AnnualLoanPayment = createMoneyComponent(getAnnualLoanPayment)

export const getAnnualInvestmentPayment = state => {
    const {
        investmentReserve
    } = getSubState(state)
    return 12 * investmentReserve * getNetPrice(state)
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

export const getPeriods = state => getSubState(state).periods

const getEquity = state => getSubState(state).equity

export const Equity = createMoneyComponent(getEquity)

export const getLoan = state => grossPrice(state) - getEquity(state)

export const Loan = createMoneyComponent(getLoan)

export const getInterestRate = state => getSubState(state).interestRate

const getTimeToDeath = state => getSubState(state).timeToDeath

const getEquityPriceIncrease = state => getSubState(state).equityPriceIncrease

const getRentIncreasePerYear = state => getSubState(state).rentIncreasePerYear

export const getAllValues = state => {
    const periods = getPeriods(state)
    const interestRate = getInterestRate(state)
    const loan = getLoan(state)
    const timeToDeath = getTimeToDeath(state)
    const valueAtBeginning = getNetPrice(state)
    const equityPriceIncrease = getEquityPriceIncrease(state)
    const rentAtBeginning = getRentPerYear(state)
    const yearlyRentIncrease = getRentIncreasePerYear(state)
    const equivalentRate = getEquivalentRate(state)
    const equity = getEquity(state)
    const monthlyPaymentRepayment = getMonthlyPaymentBuyer(state)
    const monthlyPaymentAfterRepayment = getMonthlyInvestmentPayment(state)
    return allValues({
        repaymentPeriods: periods,
        interestRate,
        loan,
        timeToDeath,
        valueAtBeginning,
        yearlyRentIncrease,
        rentAtBeginning,
        equityPriceIncrease,
        equivalentRate,
        equity,
        monthlyPaymentRepayment,
        monthlyPaymentAfterRepayment,
        transactionCost: 0,
        timeBetweenTransactions: 0
    })
}

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

const getRentPerYear = state => {
    const {
        size,
        rentPricePerSM
    } = getSubState(state)
    return 12 * size * rentPricePerSM
}

export const RentPerYear = createMoneyComponent(getRentPerYear)

const getRentPerMonth = state => getRentPerYear(state) / 12

export const RentPerMonth = createMoneyComponent(getRentPerMonth)

export const getCalculatedEquivalentRate = state => {
    const periods = getPeriods(state)
    const interestRate = getInterestRate(state)
    const loan = getLoan(state)
    const timeToDeath = getTimeToDeath(state)
    const valueAtBeginning = getNetPrice(state)
    const equityPriceIncrease = getEquityPriceIncrease(state)
    const rentAtBeginning = getRentPerYear(state)
    const yearlyRentIncrease = getRentIncreasePerYear(state)
    const equity = getEquity(state)
    const monthlyPaymentRepayment = getMonthlyPaymentBuyer(state)
    const monthlyPaymentAfterRepayment = getMonthlyInvestmentPayment(state)
    return calculateEquivalentRate({
        repaymentPeriods: periods,
        interestRate,
        loan,
        timeToDeath,
        valueAtBeginning,
        yearlyRentIncrease,
        rentAtBeginning,
        equityPriceIncrease,
        equity,
        monthlyPaymentRepayment,
        monthlyPaymentAfterRepayment,
        transactionCost: 0,
        timeBetweenTransactions: 0
    })
}

export const getLoanData = (state): loanDataType => {
    const loanAmount = getLoan(state)
    const {interestRate, periods} = getSubState(state)
    return {
        loanAmount,
        interestRate,
        periods
    }
}

export const getPropertyAssetData = (state): IassetData => {
    const equity = getNetPrice(state)
    const yieldPerPeriod = getEquityPriceIncrease(state)
    return {
        equity,
        yieldPerPeriod
    }
}
