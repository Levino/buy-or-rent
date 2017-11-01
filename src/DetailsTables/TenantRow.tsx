import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import {
  rentBetweenPeriods, savingsBetweenPeriods, stockGainBetweenPeriods, stockValueInPeriod,
  taxBetweenPeriods
} from '../helpers'
import { getLoanData, getRentData, getStockData, getTaxData } from '../selectors'
import { MoneyString } from '../helperComponents'
import { getEquivalentRate } from '../equivalentRate'

interface TenantRowInterface {
  rent: number,
  savings: number,
  stockValue: number,
  stockGain: number,
  tax: number
}

class TenantRow extends Component<TenantRowInterface> {
  render() {
    const {
      rent,
      savings,
      stockValue,
      stockGain,
      tax
    } = this.props
    return [
      <td key="rent" style={{textAlign: 'right'}}><MoneyString value={rent}/></td>,
      <td key="savings" style={{textAlign: 'right'}}><MoneyString value={savings}/></td>,
      <td key="yield" style={{textAlign: 'right'}}><MoneyString value={stockGain}/></td>,
      <td key="taxes" style={{textAlign: 'right'}}><MoneyString value={tax}/></td>,
      <td key="stockValue" style={{textAlign: 'right'}}><MoneyString value={stockValue}/></td>
  ]
  }
}

type TenantRowOwnProps = {
    period: number,
    periodGap: number
}

const mapStateToProps = (state, {period, periodGap}: TenantRowOwnProps) => {
  const rentData = getRentData(state)
  const loanData = getLoanData(state)
  const taxData = getTaxData(state)
  const stockData = getStockData(state)
  const eqYield = getEquivalentRate(state)
  const rent = rentBetweenPeriods(rentData, period, period + periodGap)
  const savings = savingsBetweenPeriods(rentData, loanData, period, period + periodGap)
  const stockValue = stockValueInPeriod(stockData, rentData, loanData, taxData, eqYield, period + periodGap)
  const stockGain = stockGainBetweenPeriods(stockData, rentData, loanData, taxData, eqYield, period, period + periodGap)
  const tax = taxBetweenPeriods(stockData, rentData, loanData, taxData, eqYield, period, period + periodGap)
  return {
    rent,
    savings,
    stockValue,
    stockGain,
    tax
  }
}

export default connect(mapStateToProps)(TenantRow)
