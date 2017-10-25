import React from 'react'
import {connect} from 'react-redux'

import {PMT} from './helpers'

const moneyString = number => `${number.toLocaleString('de', { currency: 'EUR' })} €`

const getSubState = state => state.form.mainForm.values

export const monthlyLoanPayment = (state) => {
  const {
    periods,
    interestRate,
    equity
  } = getSubState(state)

  return (-1 * PMT(interestRate / 100 / 12, periods * 12, equity)).toFixed(2)
}

export const MonthlyLoanPayment = connect(state => (
  { monthlyLoanPayment: monthlyLoanPayment(state) }
))(
  ({monthlyLoanPayment}) => moneyString(monthlyLoanPayment)
)

export const annualLoanPayment = state => 12 * monthlyLoanPayment(state)

export const AnnualLoanPayment = connect(state => (
  { annualLoanPayment: annualLoanPayment(state) }
))(
  ({annualLoanPayment}) => moneyString(annualLoanPayment)
)

export const annualInvestmentPayment = state => {
  const {
    investmentReserve
  } = getSubState(state)
  return investmentReserve / 100 * netPrice(state)
}

export const AnnualInvestmentPayment = connect(state => (
  { annualInvestmentPayment: annualInvestmentPayment(state) }
))(
  ({annualInvestmentPayment}) => moneyString(annualInvestmentPayment)
)

export const netPrice = (state) => {
  const {
    buyPricePerSM,
    size
  } = getSubState(state)
  return buyPricePerSM * size
}

export const grossPrice = (state) => {
  const {
    notaryFee,
    propertyPurchaseTax,
    brokerFee
  } = getSubState(state)
  return netPrice(state) * (1 + (notaryFee + brokerFee + propertyPurchaseTax) / 100)
}
