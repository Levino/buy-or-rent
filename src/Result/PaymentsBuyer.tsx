import * as React from 'react'
import { Row, Col, Table } from 'reactstrap'
import {
  MonthlyLoanPayment, AnnualLoanPayment, AnnualInvestmentPayment,
  MonthlyInvestmentPayment, YearlyPaymentBuyer, MonthlyPaymentBuyer
} from '../selectors'

const TableRow = ({title, PerYear, PerMonth, result}) => <tr>
  <td style={{fontWeight: result ? 'bold' : 'normal' }} scope="row" key="title">{title}</td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="perMonth"><PerMonth/></td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="perYear"><PerYear/></td>
</tr>

const PaymentsRepaymentPeriod = () => {
  const entries = [
    {
      title: 'Tilgung',
      PerMonth: MonthlyLoanPayment,
      PerYear: AnnualLoanPayment,
        result: false
    },
    {
      title: 'Investitionsrücklage',
      PerYear: AnnualInvestmentPayment,
      PerMonth: MonthlyInvestmentPayment,
        result: false
    },
    {
      title: 'Summe',
      PerYear: YearlyPaymentBuyer,
      PerMonth: MonthlyPaymentBuyer,
      result: true
    }
  ]
  const Content = () : any => (<Table size="sm">
      <thead>
        <tr>
          <th scope="col">Verwendung</th>
          <th style={{textAlign: 'right'}} scope="col">monatlich</th>
          <th style={{textAlign: 'right'}} scope="col">jährlich</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
      </tbody>
    </Table>);
  const Heading = () => <h3>Zahlungen Käufer Tilgungsphase</h3>
  return <Row><Col>
    <Heading key="heading"/>
    <Content key="content"/>
  </Col></Row>
}

const PaymentsDyingPeriod = ()  =>  {
  const entries = [
    {
      title: 'Investitionsrücklage',
      PerYear: AnnualInvestmentPayment,
      PerMonth: MonthlyInvestmentPayment,
        result: false
    },
    {
      title: 'Summe',
      PerYear: AnnualInvestmentPayment,
      PerMonth: MonthlyInvestmentPayment,
      result: true
    }
  ]
  const Content = ()  => <Table size="sm">
    <thead>
    <tr>
      <th scope="col">Verwendung</th>
      <th style={{textAlign: 'right'}} scope="col">monatlich</th>
      <th style={{textAlign: 'right'}} scope="col">jährlich</th>
    </tr>
    </thead>
    <tbody>
    {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
    </tbody>
  </Table>
  const Heading = ()  => <h3>Zahlungen Käufer Sterbephase</h3>
  return <Row><Col>
    <Heading key="heading"/>
    <Content key="content"/>
  </Col></Row>
}

const PaymentsBuyer = () => <Row><Col>
  <PaymentsRepaymentPeriod/>
</Col><Col>
  <PaymentsDyingPeriod/>
</Col></Row>

export default PaymentsBuyer
