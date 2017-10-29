import * as React from 'react'
import { Table } from 'reactstrap'
import {getAllValues, getInterestRate, getLoan, getMonthlyLoanPayment} from './selectors';
import { connect } from 'react-redux'
import { MoneyString } from './helperComponents'
import {restOfLoan} from './helpers';

const LoanPaymentsComponent = ({allValues, loanAmount, monthlyLoanPayment, interestRate}) => {
    const restOfLoanForPeriod = (period) => restOfLoan(monthlyLoanPayment, loanAmount, interestRate / 12, period)
    return <Table size="sm" bordered>
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
                <td style={{textAlign: 'right'}}><MoneyString value={loanAtBeginning}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={loanPayment}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={interest}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={restOfLoanForPeriod((year - 2017)*12)}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={valueOfProperty}/></td>
                <td style={{textAlign: 'right', fontWeight: 'bold'}}><MoneyString value={networth}/></td>
                {/* Mieter */}
                <td style={{textAlign: 'right'}}><MoneyString value={yearlyRent}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={monthlyRent}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={yearlyInvestment}/></td>
                <td style={{textAlign: 'right'}}><MoneyString value={stockGain}/></td>
                <td/>
                <td style={{textAlign: 'right'}}><MoneyString value={stockValue}/></td>
                <td style={{textAlign: 'right', fontWeight: 'bold'}}><MoneyString value={stockValue}/></td>
            </tr>
        ))
        }
        </tbody>
    </Table>
}

const mapStateToProps = (state: any) => {
    return {
        allValues: getAllValues(state),
        loanAmount: getLoan(state),
        monthlyLoanPayment: getMonthlyLoanPayment(state),
        interestRate: getInterestRate(state)
    }
}

export default connect(mapStateToProps)(LoanPaymentsComponent)
