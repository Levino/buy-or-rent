import * as React from 'react'
import {MoneyString} from "./helperComponents"
import {connect} from 'react-redux'
const TotalTax = ({value}) => <MoneyString value={value}/>

const mapStateToProps = state => ({
  value: state.app.periods.values[state.app.periods.totalPeriods].tenantData.totalTax
})

export default connect(mapStateToProps)(TotalTax)
