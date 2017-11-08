import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { selectors as resultSelectors } from './redux'
import { selectors as calclatingSelectors } from '../reducers'

const { getResult } = resultSelectors
const { getCalculating } = calclatingSelectors


interface EquivalentYieldInterface {
  equivalentYield: number
  calculating: boolean
}

const percentString = value => value.toLocaleString('de-DE', {style: 'percent', minimumFractionDigits: 2})

class EquivalentYield extends Component<EquivalentYieldInterface> {
  render() {
    const { equivalentYield, calculating } = this.props
    const result = [
      <h3 key="title">Äquivalenzrendite</h3>,
    ]
    if (calculating) {
      result.push(<div key="calculating">Calculating</div> )
    } else {
      result.push(<div key="equivalentYield">{percentString(equivalentYield)}</div>)
    }
    return result
  }
}

const mapStateToProps = (state) => {
  return {
    equivalentYield: 12 * getResult(state).data.stockData.stockIncreasePerPeriod * 12,
    calculating: getCalculating(state)
  }
}

export default connect(mapStateToProps)(EquivalentYield)
