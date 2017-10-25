import React from 'react'
import {connect} from 'react-redux'

import {PMT} from './helpers'

const moneyString = number => `${number.toLocaleString('de', { currency: 'EUR' })} €`

const getSubState = state => state.form.mainForm.values

const createMoneyComponent = selector => connect(state => (
  { value: selector(state) }
))(
  ({value}) => moneyString(value)
)

export const monthlyLoanPayment = (state) => {
  const {
    periods,
    interestRate,
    equity
  } = getSubState(state)

  return (-1 * PMT(interestRate / 100 / 12, periods * 12, equity)).toFixed(2)
}

export const MonthlyLoanPayment = createMoneyComponent(monthlyLoanPayment)

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
