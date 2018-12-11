import * as React from 'react'
import { connect } from 'react-redux'
import { MoneyString } from 'src/helperComponents'
import { getPeriods } from 'src/selectors'

export interface TenantRowProps {
  rent: number
  savings: number
  stockValue: number
  stockGain: number
  tax: number
}

class TenantRow extends React.Component<TenantRowProps> {
  public render() {
    const { rent, savings, stockValue, stockGain, tax } = this.props
    return [
      <td key="rent" style={{ textAlign: 'right' }}>
        <MoneyString value={rent} />
      </td>,
      <td key="savings" style={{ textAlign: 'right' }}>
        <MoneyString value={savings} />
      </td>,
      <td key="yield" style={{ textAlign: 'right' }}>
        <MoneyString value={stockGain} />
      </td>,
      <td key="taxes" style={{ textAlign: 'right' }}>
        <MoneyString value={tax} />
      </td>,
      <td key="stockValue" style={{ textAlign: 'right' }}>
        <MoneyString value={stockValue} />
      </td>,
    ]
  }
}

export interface TenantRowOwnProps {
  period: number
  periodGap: number
}
const mapStateToProps = (
  state,
  { periodGap, period }: TenantRowOwnProps
): TenantRowProps => {
  const periods = getPeriods(state)
  const lastPeriod = periods[period]
  const nextPeriod = periods[period + periodGap]
  return {
    rent: nextPeriod.tenantData.totalRent - lastPeriod.tenantData.totalRent,
    savings:
      nextPeriod.tenantData.totalSavings - lastPeriod.tenantData.totalSavings,
    stockGain:
      nextPeriod.tenantData.totalStockValueIncrease -
      lastPeriod.tenantData.totalStockValueIncrease,
    stockValue: nextPeriod.tenantData.stockValue,
    tax: nextPeriod.tenantData.totalTax - lastPeriod.tenantData.totalTax,
  }
}

export default connect(mapStateToProps)(TenantRow)
