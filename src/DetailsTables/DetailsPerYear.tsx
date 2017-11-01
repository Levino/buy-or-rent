import * as React from 'react'
import { Table } from 'reactstrap'
import { getTotalPeriods } from '../selectors'
import { connect } from 'react-redux'
import { times } from 'lodash'

import BuyerRow from './BuyerRow'
import TenantRow from './TenantRow'

interface DetailsTableProps {
  periods: number,
  format?: 'years' | 'months'
}

const periodToYear = period => Math.round((period + 1 ) / 12 + 2018)

const HeadRowYear = () => (
  <tr>
    <th>Jahr</th>
    {/* Käufer */}
    <th style={{textAlign: 'right'}}>Schulden Jahresbeginn</th>
    <th style={{textAlign: 'right'}}>Tilgung</th>
    <th style={{textAlign: 'right'}}>Zinsen</th>
    <th style={{textAlign: 'right'}}>Schulden Jahresende</th>
    <th style={{textAlign: 'right'}}>Wert Immobilie Jahresende</th>
    <th style={{textAlign: 'right'}}>Networth</th>
    {/* Mieter */}
    <th style={{textAlign: 'right'}}>Jahresmiete</th>
    <th style={{textAlign: 'right'}}>Sparrate</th>
    <th style={{textAlign: 'right'}}>Rendite</th>
    <th style={{textAlign: 'right'}}>Steuern</th>
    <th style={{textAlign: 'right'}}>Aktienvermögen Jahresende</th>
    <th style={{textAlign: 'right'}}>Networth</th>
  </tr>
)

const HeadRowMonth = () => (
  <tr>
    <th>Jahr</th>
    {/* Käufer */}
    <th style={{textAlign: 'right'}}>Schulden Monatsbeginn</th>
    <th style={{textAlign: 'right'}}>Tilgung</th>
    <th style={{textAlign: 'right'}}>Zinsen</th>
    <th style={{textAlign: 'right'}}>Schulden Monatsende</th>
    <th style={{textAlign: 'right'}}>Wert Immobilie Monatsende</th>
    <th style={{textAlign: 'right'}}>Networth</th>
    {/* Mieter */}
    <th style={{textAlign: 'right'}}>Monatsmiete</th>
    <th style={{textAlign: 'right'}}>Sparrate</th>
    <th style={{textAlign: 'right'}}>Rendite</th>
    <th style={{textAlign: 'right'}}>Steuern</th>
    <th style={{textAlign: 'right'}}>Aktienvermögen Monatsende</th>
    <th style={{textAlign: 'right'}}>Networth</th>
  </tr>
)

const DetailsTable = ({periods, format = 'years'}: DetailsTableProps) => {
  // If format is years then we only want to render every 12th period
  let periodsArray = times(periods)
  let periodGap = 1
  if (format === 'years') {
    periodsArray = periodsArray.filter(period => (period % 12 === 0))
    periodGap = 12
  } else {
    periodsArray = times(Math.min(periods, 10))
  }
  return <Table size="sm" bordered={true} responsive={true}>
    <thead>
    <tr>
      <th/>
      <th style={{textAlign: 'center'}} colSpan={6}>Käufer</th>
      <th style={{textAlign: 'center'}} colSpan={6}>Mieter</th>
    </tr>
    { format === 'years' ? <HeadRowYear/> : <HeadRowMonth/>}
    </thead>
    <tbody>
    {
      periodsArray.map((period, index) => (
        <tr key={period}>
          <td>{(format === 'years') ? periodToYear(period) : period + 1}</td>
          {/* Käufer */}
          <BuyerRow period={period} periodGap={periodGap}/>
          <TenantRow period={period} periodGap={periodGap}/>
        </tr>
      ))
    }
    </tbody>
  </Table>
}

const mapStateToProps = (state: any) => {
  return {
    periods: getTotalPeriods(state)
  }
}

export default connect(mapStateToProps)(DetailsTable)
