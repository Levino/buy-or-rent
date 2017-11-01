import * as React from 'react'
import { getLoanData, getPropertyAssetData } from '../selectors'
import { connect } from 'react-redux'
import { MoneyString } from '../helperComponents'
import { assetValuation, interestBetween, netWorth, PMT, restOfLoan } from '../helpers'
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
  const loanData = getLoanData(state)
  const equityData = getPropertyAssetData(state)
  const loanPaymentPerPeriod = PMT(loanData.interestRate, loanData.periods, loanData.loanAmount)

  return {
    loanAmount: restOfLoan(loanData, period),
    loanAmountAtEnd: restOfLoan(loanData, period + periodGap),
    assetValuationAtEnd: assetValuation(equityData, period + periodGap),
    interestBetweenPeriods: interestBetween(loanData, period, period + periodGap),
    loanPayment: loanPaymentPerPeriod * (periodGap),
    netWorthAtEnd: netWorth(loanData, equityData, period + periodGap),
    period,
    periodGap
  }
}

export default connect(mapStateToProps)(BuyerRow)
