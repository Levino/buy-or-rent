import * as React from 'react'
import {MoneyString} from "./helperComponents"
import {connect} from 'react-redux'
const TotalTax = ({value}) => <MoneyString value={value}/>

const mapStateToProps = state => ({
  value: state.periods.totalTax
})

export default connect(mapStateToProps)(TotalTax)
