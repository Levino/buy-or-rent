import { PMT } from './helpers'

const getSubState = state => state.form.mainForm.values

export const annualPayment = (state) => {
  const {
    periods,
    interestRate,
    equity
  } = getSubState(state)

  return (-1 * PMT(interestRate / 100, periods, equity)).toFixed(2)
}

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
