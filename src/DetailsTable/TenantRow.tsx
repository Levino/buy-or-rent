import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { rentBetweenPeriods } from '../helpers'
import { getRentData } from '../selectors'
import { MoneyString } from '../helperComponents'

interface TenantRowInterface {
  rent: number
}

class TenantRow extends Component<TenantRowInterface> {
  render() {
    const {
      rent
    } = this.props
    return [
      <td style={{textAlign: 'right'}}><MoneyString value={rent}/></td>
    ]
  }
}

type TenantRowOwnProps = {
    period: number,
    periodGap: number
}

const mapStateToProps = (state, {period, periodGap}: TenantRowOwnProps) => {
  const rentData = getRentData(state)
  const rent = rentBetweenPeriods(rentData, period, period + periodGap)
  return {
    rent
  }
}

export default connect(mapStateToProps)(TenantRow)
