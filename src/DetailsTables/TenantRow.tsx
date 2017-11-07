import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { getPeriods } from '../selectors'
import { MoneyString } from '../helperComponents'

export interface TenantRowInterface {
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

export type TenantRowOwnProps = {
    period: number,
    periodGap: number
}

const mapStateToProps = (state, {periodGap, period}: TenantRowOwnProps): TenantRowInterface => {
  const periods = getPeriods(state)
  const lastPeriod = periods[period]
  const nextPeriod = periods[period + periodGap]
  return {
    rent: nextPeriod.tenantData.totalRent - lastPeriod.tenantData.totalRent,
    savings: nextPeriod.tenantData.totalSavings - lastPeriod.tenantData.totalSavings,
    stockValue: nextPeriod.tenantData.stockValue,
    stockGain: nextPeriod.tenantData.totalStockValueIncrease - lastPeriod.tenantData.totalStockValueIncrease,
    tax: nextPeriod.tenantData.totalTax - lastPeriod.tenantData.totalTax
  }
}

export default connect(mapStateToProps)(TenantRow)
