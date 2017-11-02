import * as React from 'react'
import { getPeriods } from '../selectors'
import { connect } from 'react-redux'
import { MoneyString } from '../helperComponents'
import { Component } from 'react'
import { TenantRowOwnProps } from './TenantRow'

export interface BuyerRowInterface {
  period: number
  loanPayment: number
  loanAmountAtEnd: number
  loanAmountAtBeginning: number
  interest: number
  houseValue: number
  netWorth: number
}

class BuyerRow extends Component<BuyerRowInterface> {
  render() {
    const {
      loanPayment,
      loanAmountAtBeginning,
      loanAmountAtEnd,
      interest,
      houseValue,
      netWorth
    } = this.props
    return [
      <td key="loanAmount" style={{textAlign: 'right'}}><MoneyString value={loanAmountAtBeginning}/></td>,
      <td key="loanPayment" style={{textAlign: 'right'}}><MoneyString value={loanPayment}/></td>,
      <td key="interest" style={{textAlign: 'right'}}>
        <MoneyString
          value={interest}
        />
      </td>,
      <td key="loanNextPeriod" style={{textAlign: 'right'}}><MoneyString value={loanAmountAtEnd}/></td>,
      <td
        key="assetValuation"
        style={{textAlign: 'right'}}
      >
        <MoneyString value={houseValue}/>
      </td>,
      <td key="netWorth" style={{textAlign: 'right'}}><MoneyString value={netWorth}/>
      </td>
    ]
  }
}

const mapStateToProps = (state, {period, years}: TenantRowOwnProps ): BuyerRowInterface => {
  let timeframe = 'months'
  if (years) {
    timeframe = 'years'
  }
  return getPeriods(state)[timeframe][period].buyerData
}

export default connect(mapStateToProps)(BuyerRow)
