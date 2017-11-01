import * as React from 'react'
import { connect } from 'react-redux'
import { getLoanData, getPropertyAssetData, getRentData, getStockData, getTaxData } from '../selectors'
import { equivalentYield } from '../helpers'
import { Component } from 'react'

interface EquivalentYieldInterface {
  equivalentYield: number
}

const percentString = value => value.toLocaleString('de-DE', {style: 'percent', minimumFractionDigits: 2})

class EquivalentYield extends Component<EquivalentYieldInterface> {
  render() {
    const { equivalentYield } = this.props
    return [
      <h3 key="title">Äquivalenzrendite</h3>,
      <div key="equivalentYield">{percentString(equivalentYield)}</div>
    ]
  }
}

const mapStateToProps = (state) => {
  const rentData = getRentData(state)
  const loanData = getLoanData(state)
  const taxData = getTaxData(state)
  const stockData = getStockData(state)
  const assetData = getPropertyAssetData(state)
  return {
    equivalentYield: 12 * equivalentYield(stockData, rentData, loanData, taxData, assetData, 20 * 12)
  }
}

export default connect(mapStateToProps)(EquivalentYield)
