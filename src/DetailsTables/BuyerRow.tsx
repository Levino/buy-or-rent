import * as React from 'react'
import { connect } from 'react-redux'
import { MoneyString } from '../helperComponents'
import { getPeriods } from '../selectors'
import { TenantRowOwnProps } from './TenantRow'

export interface BuyerRowProps {
  period: number
  loanPayment: number
  loanAtEnd: number
  loanAtBeginning: number
  interest: number
  propertyValue: number
  networth: number
}

const BuyerRow: React.FunctionComponent<BuyerRowProps> = ({
  loanPayment,
  loanAtBeginning,
  loanAtEnd,
  interest,
  propertyValue,
  networth,
}) => (
    <React.Fragment>
      {[
        <td key="loan" style={{ textAlign: 'right' }}>
          <MoneyString value={loanAtBeginning} />
        </td>,
        <td key="loanPayment" style={{ textAlign: 'right' }}>
          <MoneyString value={loanPayment} />
        </td>,
        <td key="interest" style={{ textAlign: 'right' }}>
          <MoneyString value={interest} />
        </td>,
        <td key="loanNextPeriod" style={{ textAlign: 'right' }}>
          <MoneyString value={loanAtEnd} />
        </td>,
        <td key="assetValuation" style={{ textAlign: 'right' }}>
          <MoneyString value={propertyValue} />
        </td>,
        <td key="networth" style={{ textAlign: 'right' }}>
          <MoneyString value={networth} />
        </td>]}
    </React.Fragment>
  )

const mapStateToProps = (
  state,
  { period, periodGap }: TenantRowOwnProps
): BuyerRowProps => {
  const periods = getPeriods(state)
  const lastPeriod = periods[period]
  const nextPeriod = periods[period + periodGap]
  return {
    interest:
      nextPeriod.buyerData.totalInterest - lastPeriod.buyerData.totalInterest,
    loanAtBeginning: lastPeriod.buyerData.loanAmount,
    loanAtEnd: nextPeriod.buyerData.loanAmount,
    loanPayment:
      nextPeriod.buyerData.totalPayments - lastPeriod.buyerData.totalPayments,
    networth: nextPeriod.buyerData.networth,
    period,
    propertyValue: nextPeriod.buyerData.propertyValue,
  }
}

export default connect(mapStateToProps)(BuyerRow)
