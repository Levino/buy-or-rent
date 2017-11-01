import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { rentBetweenPeriods, savingsBetweenPeriods } from '../helpers'
import { getLoanData, getRentData } from '../selectors'
import { MoneyString } from '../helperComponents'

interface TenantRowInterface {
  rent: number,
  savings: number
}

class TenantRow extends Component<TenantRowInterface> {
  render() {
    const {
      rent,
      savings
    } = this.props
    return [
      <td key="rent" style={{textAlign: 'right'}}><MoneyString value={rent}/></td>,
      <td key="savings" style={{textAlign: 'right'}}><MoneyString value={savings}/></td>
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
  const rent = rentBetweenPeriods(rentData, period, period + periodGap)
  const savings = savingsBetweenPeriods(rentData, loanData, period, period + periodGap)
  return {
    rent,
    savings
  }
}

export default connect(mapStateToProps)(TenantRow)
