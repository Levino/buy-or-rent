import React from 'react'
import { Table } from 'reactstrap'
import { getLoanPayments } from './selectors'
import { connect } from 'react-redux'
import { moneyString } from './helpers'

const LoanPaymentsComponent = ({loanPayments}) => (
  <Table>
    <thead>
     <tr>
       <th>Year</th>
       <th>Loan at beginning of period</th>
       <th>Annual Payment</th>
     </tr>
    </thead>
    <tbody style={{textAlign: 'right'}}>
    {loanPayments.map(({year, loanAtBeginning, loanAtEnd, loanPayment }, key) => (
      <tr key={key}>
        <td>{year}</td>
        <td>{moneyString(loanAtBeginning)}</td>
        <td>{moneyString(loanPayment)}</td>
        <td>{moneyString(loanAtEnd)}</td>
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
