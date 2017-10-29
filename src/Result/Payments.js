import React from 'react'
import { Row, Col, Table } from 'reactstrap'
import {
  MonthlyLoanPayment, AnnualLoanPayment, AnnualInvestmentPayment,
  MonthlyInvestmentPayment, YearlyPaymentBuyer, MonthlyPaymentBuyer
} from '../selectors'

const TableRow = ({title, PerYear, PerMonth, result}) => <tr>
  <td style={{fontWeight: result ? 'bold' : null }} scope="row" key="title">{title}</td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : null }} key="perMonth"><PerMonth/></td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : null }} key="perYear"><PerYear/></td>
</tr>

const PurchaseCost = () => {
  const entries = [
    {
      title: 'Tilgung',
      PerMonth: MonthlyLoanPayment,
      PerYear: AnnualLoanPayment
    },
    {
      title: 'Investitionsrücklage',
      PerYear: AnnualInvestmentPayment,
      PerMonth: MonthlyInvestmentPayment
    },
    {
      title: 'Summe',
      PerYear: YearlyPaymentBuyer,
      PerMonth: MonthlyPaymentBuyer,
      result: true
    }
  ]
  const Content = () => <Table size="sm">
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
  const Heading = () => <h3>Zahlungen Käufer Tilgungsphase</h3>
  return <Row><Col>
    <Heading key="heading"/>
    <Content key="content"/>
  </Col></Row>
}

export default PurchaseCost
