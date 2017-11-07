import * as React from 'react'
import { getPeriods } from '../selectors'
import { connect } from 'react-redux'
import { MoneyString } from '../helperComponents'
import { Component } from 'react'
import { TenantRowOwnProps } from './TenantRow'

export interface BuyerRowInterface {
  period: number
  loanPayment: number
  loanAtEnd: number
  loanAtBeginning: number
  interest: number
  propertyValue: number
  networth: number
}

class BuyerRow extends Component<BuyerRowInterface> {
  render() {
    const {
      loanPayment,
      loanAtBeginning,
      loanAtEnd,
      interest,
      propertyValue,
      networth
    } = this.props
    return [
      <td key="loan" style={{textAlign: 'right'}}><MoneyString value={loanAtBeginning}/></td>,
      <td key="loanPayment" style={{textAlign: 'right'}}><MoneyString value={loanPayment}/></td>,
      <td key="interest" style={{textAlign: 'right'}}>
        <MoneyString
          value={interest}
        />
      </td>,
      <td key="loanNextPeriod" style={{textAlign: 'right'}}><MoneyString value={loanAtEnd}/></td>,
      <td
        key="assetValuation"
        style={{textAlign: 'right'}}
      >
        <MoneyString value={propertyValue}/>
      </td>,
      <td key="networth" style={{textAlign: 'right'}}><MoneyString value={networth}/>
      </td>
    ]
  }
}

const mapStateToProps = (state, {period, periodGap}: TenantRowOwnProps ): BuyerRowInterface => {
  const periods = getPeriods(state)
  const lastPeriod = periods[period]
  const nextPeriod = periods[period + periodGap]
  return {
    period,
    loanPayment: nextPeriod.buyerData.totalPayments - lastPeriod.buyerData.totalPayments,
    loanAtBeginning: lastPeriod.buyerData.loanAmount,
    loanAtEnd: nextPeriod.buyerData.loanAmount,
    interest: nextPeriod.buyerData.totalInterest - lastPeriod.buyerData.totalInterest,
    propertyValue: nextPeriod.buyerData.propertyValue,
    networth: nextPeriod.buyerData.networth
  }
}

export default connect(mapStateToProps)(BuyerRow)
