import React from 'react'
import { Table } from 'reactstrap'
import { getLoanPayments } from './selectors'
import { connect } from 'react-redux'
import { moneyString } from './helpers'

const LoanPaymentsComponent = ({loanPayments}) => (
  <Table size="sm">
    <thead>
     <tr>
       <th>Jahr</th>
       <th style={{textAlign: 'right'}}>Kredit Jahresbeginn</th>
       <th style={{textAlign: 'right'}}>Tilgung</th>
       <th style={{textAlign: 'right'}}>Zinsen</th>
       <th style={{textAlign: 'right'}}>Kredit Jahresende</th>
     </tr>
    </thead>
      <tbody>
    {loanPayments.map(({year, loanAtBeginning, loanAtEnd, loanPayment, interest }, key) => (
      <tr key={key}>
        <td>{year}</td>
        <td style={{textAlign: 'right'}}>{moneyString(loanAtBeginning)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(loanPayment)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(interest)}</td>
        <td style={{textAlign: 'right'}}>{moneyString(loanAtEnd)}</td>
      </tr>
    ))
    }
    </tbody>
  </Table>
)

const mapStateToProps = state => {
  return {loanPayments: getLoanPayments(state)}
}

export default connect(mapStateToProps)(LoanPaymentsComponent)
