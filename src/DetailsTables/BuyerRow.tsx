import * as React from 'react'
import { getTheData } from '../selectors'
import { connect } from 'react-redux'
import { MoneyString } from '../helperComponents'
import { assetValuation, interestBetween, loanPaymentPerPeriod, netWorth, restOfLoan } from '../helpers'
import { Component } from 'react'

interface BuyerRowInterface {
  period: number
  loanPayment: number
  periodGap: number
  loanAmountAtEnd: number
  loanAmount: number
  interestBetweenPeriods: number
  assetValuationAtEnd: number
  netWorthAtEnd: number
}

class BuyerRow extends Component<BuyerRowInterface> {
  render() {
    const {
      loanPayment,
      loanAmount,
      loanAmountAtEnd,
      interestBetweenPeriods,
      assetValuationAtEnd,
      netWorthAtEnd
    } = this.props
    return [
      <td key="loanAmount" style={{textAlign: 'right'}}><MoneyString value={loanAmount}/></td>,
      <td key="loanPayment" style={{textAlign: 'right'}}><MoneyString value={loanPayment}/></td>,
      <td key="interest" style={{textAlign: 'right'}}>
        <MoneyString
          value={interestBetweenPeriods}
        />
      </td>,
      <td key="loanNextPeriod" style={{textAlign: 'right'}}><MoneyString value={loanAmountAtEnd}/></td>,
      <td
        key="assetValuation"
        style={{textAlign: 'right'}}
      >
        <MoneyString value={assetValuationAtEnd}/>
      </td>,
      <td key="netWorth" style={{textAlign: 'right'}}><MoneyString value={netWorthAtEnd}/>
      </td>
    ]
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const {
    period,
    periodGap
  } = ownProps
  const data = getTheData(state)
  const loanPaymentPerPeriodValue = loanPaymentPerPeriod(data, period)

  return {
    loanAmount: restOfLoan(data, period),
    loanAmountAtEnd: restOfLoan(data, period + periodGap),
    assetValuationAtEnd: assetValuation(data, period + periodGap),
    interestBetweenPeriods: interestBetween(data, period, period + periodGap),
    loanPayment: loanPaymentPerPeriodValue * (periodGap),
    netWorthAtEnd: netWorth(data, period + periodGap),
    period,
    periodGap
  }
}

export default connect(mapStateToProps)(BuyerRow)
