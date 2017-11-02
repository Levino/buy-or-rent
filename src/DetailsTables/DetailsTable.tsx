import * as React from 'react'
import { Table } from 'reactstrap'
import { getTotalPeriods } from '../selectors'
import { connect } from 'react-redux'
import { times } from 'lodash'

import TenantRow from './TenantRow'
import BuyerRow from './BuyerRow'

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
    <th style={{textAlign: 'right'}}>Zuwachs Aktienvermögen</th>
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
  if (format === 'years') {
    periodsArray = times(periods / 12)
  } else {
    periodsArray = times(10)
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
          <BuyerRow period={period} years={format === 'years'}/>
          <TenantRow period={period} years={format === 'years'}/>
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
