import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import {
  rentBetweenPeriods, savingsBetweenPeriods, stockGainBetweenPeriods, stockValueInPeriod,
  taxBetweenPeriods
} from '../helpers'
import { getTheData } from '../selectors'
import { MoneyString } from '../helperComponents'

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
  const data = getTheData(state)
  const rent = rentBetweenPeriods(data, period - 1, period - 1 + periodGap)
  const savings = savingsBetweenPeriods(data, period, period + periodGap)
  const stockValue = stockValueInPeriod(data, period + periodGap)
  const stockGain = stockGainBetweenPeriods(data, period, period + periodGap)
  const tax = taxBetweenPeriods(data, period, period + periodGap)
  return {
    rent,
    savings,
    stockValue,
    stockGain,
    tax
  }
}

export default connect(mapStateToProps)(TenantRow)
