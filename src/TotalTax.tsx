import * as React from 'react'
import {connect} from 'react-redux'
import {MoneyString} from './helperComponents'
const TotalTax = ({value}) => <MoneyString value={value}/>

const mapStateToProps = state => ({
  value: state.result.periods[state.result.totalPeriods].tenantData.totalTax,
})

export default connect(mapStateToProps)(TotalTax)

