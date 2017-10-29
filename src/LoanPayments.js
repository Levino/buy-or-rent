import React from 'react'
import { Table } from 'reactstrap'
import { getAllValues } from './selectors'
import { connect } from 'react-redux'
import { moneyString } from './helpers'

const LoanPaymentsComponent = ({allValues}) => (
  <Table size="sm" bordered>
    <thead>
    <tr>
      <th/>
      <th style={{textAlign: 'center'}} colSpan={6}>Käufer</th>
      <th style={{textAlign: 'center'}} colSpan={6}>Mieter</th>
    </tr>
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
       <th style={{textAlign: 'right'}}>Monatsmiete</th>
       <th style={{textAlign: 'right'}}>Sparrate</th>
       <th style={{textAlign: 'right'}}>Rendite</th>
       <th style={{textAlign: 'right'}}>Steuern</th>
       <th style={{textAlign: 'right'}}>Aktienvermögen Jahresende</th>
       <th style={{textAlign: 'right'}}>Networth</th>
     </tr>
    </thead>
      <tbody>
    {allValues.map(({year, loanAtBeginning, loanAtEnd, loanPayment, interest, valueOfProperty, networth, yearlyRent, monthlyRent, yearlyInvestment, stockValue, stockGain}, key) => (
      <tr key={key}>
        <td>{year}</td>
        {/* Käufer */}
        <td style={{textAlign: 'right'}}>{moneyString(loanAtBeginning)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(loanPayment)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(interest)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(loanAtEnd)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(valueOfProperty)}</td>
        <td style={{textAlign: 'right', fontWeight: 'bold'}}>{moneyString(networth)}</td>
        {/* Mieter */}
        <td style={{textAlign: 'right'}}>{moneyString(yearlyRent)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(monthlyRent)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(yearlyInvestment)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(stockGain)}</td>
        <td/>
        <td style={{textAlign: 'right'}}>{moneyString(stockValue)}</td>
        <td style={{textAlign: 'right', fontWeight: 'bold'}}>{moneyString(stockValue)}</td>
      </tr>
    ))
    }
    </tbody>
  </Table>
)

const mapStateToProps = state => {
  return {allValues: getAllValues(state)}
}

export default connect(mapStateToProps)(LoanPaymentsComponent)
