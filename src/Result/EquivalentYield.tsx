import * as React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { selectors as calclatingSelectors } from '../reducers'
import { selectors as resultSelectors } from './redux'

const { getResult } = resultSelectors
const { getCalculating } = calclatingSelectors


interface EquivalentYieldInterface {
  equivalentYield: number
  calculating: boolean
}

const percentString = value => value.toLocaleString('de-DE', {style: 'percent', minimumFractionDigits: 2})

class EquivalentYield extends Component<EquivalentYieldInterface> {
  public render() {
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
    calculating: getCalculating(state),
    equivalentYield: 12 * getResult(state).data.stockData.stockIncreasePerPeriod,
  }
}

export default connect(mapStateToProps)(EquivalentYield)
