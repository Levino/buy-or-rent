import * as React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { getEquivalentRate, getEquivalentRateStatus } from '../reducers'

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
    equivalentYield: 12 * getEquivalentRate(state),
    calculating: (getEquivalentRateStatus(state) === 'calculating')
  }
}

export default connect(mapStateToProps)(EquivalentYield)
