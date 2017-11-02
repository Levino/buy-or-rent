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
    years: boolean
}

const mapStateToProps = (state, {years, period}: TenantRowOwnProps): TenantRowInterface => {
  let timeframe = 'months'
  if (years) {
    timeframe = 'years'
  }
  return getPeriods(state)[timeframe][period].tenantData
}

export default connect(mapStateToProps)(TenantRow)
