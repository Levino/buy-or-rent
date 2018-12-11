import * as React from 'react'
import { Card, CardBody, CardTitle, Col, Row, Table } from 'reactstrap'
import {
  AnnualInvestmentPayment, AnnualLoanPayment, MonthlyInvestmentPayment,
  MonthlyLoanPayment, MonthlyPaymentBuyer, YearlyPaymentBuyer
} from '../selectors'

const TableRow = ({ title, PerYear, PerMonth, result }: { title: string, PerYear: any, PerMonth, result?: boolean }) => <tr>
  <td style={{ fontWeight: result ? 'bold' : 'normal' }} scope="row" key="title">{title}</td>
  <td style={{ textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="perMonth"><PerMonth /></td>
  <td style={{ textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="perYear"><PerYear /></td>
</tr>

const PaymentsRepaymentPeriod = () => {
  const entries = [
    {
      PerMonth: MonthlyLoanPayment,
      PerYear: AnnualLoanPayment,
      result: false,
      title: 'Tilgung',
    },
    {
      PerMonth: MonthlyInvestmentPayment,
      PerYear: AnnualInvestmentPayment,
      result: false,
      title: 'Investitionsrücklage',
    },
    {
      PerMonth: MonthlyPaymentBuyer,
      PerYear: YearlyPaymentBuyer,
      result: true,
      title: 'Summe',
    },
  ]
  const Content = () => (<Table responsive={true} size="sm">
    <thead>
      <tr>
        <th scope="col">Verwendung</th>
        <th style={{ textAlign: 'right' }} scope="col">monatlich</th>
        <th style={{ textAlign: 'right' }} scope="col">jährlich</th>
      </tr>
    </thead>
    <tbody>
      {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
    </tbody>
  </Table>)
  const Heading = () => <span>Zahlungen Käufer Tilgungsphase</span>
  return (<Card>
    <CardBody>
      <CardTitle>
        <Heading key="heading" />
      </CardTitle>
      <Content key="content" />
    </CardBody>
  </Card>)
}

const PaymentsDyingPeriod = () => {
  const entries = [
    {
      PerMonth: MonthlyInvestmentPayment,
      PerYear: AnnualInvestmentPayment,
      result: false,
      title: 'Investitionsrücklage',
    },
    {
      PerMonth: MonthlyInvestmentPayment,
      PerYear: AnnualInvestmentPayment,
      result: true,
      title: 'Summe',
    },
  ]
  const Content = () => <Table responsive={true} size="sm">
    <thead>
      <tr>
        <th scope="col">Verwendung</th>
        <th style={{ textAlign: 'right' }} scope="col">monatlich</th>
        <th style={{ textAlign: 'right' }} scope="col">jährlich</th>
      </tr>
    </thead>
    <tbody>
      {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
    </tbody>
  </Table>
  const Heading = () => <span>Zahlungen Käufer Sterbephase</span>
  return <Card>
    <CardBody>
      <CardTitle>
        <Heading key="heading" />
      </CardTitle>
      <Content key="content" />
    </CardBody>
  </Card>
}

const PaymentsBuyer = () => <Row><Col>
  <PaymentsRepaymentPeriod />
</Col><Col>
    <PaymentsDyingPeriod />
  </Col></Row>

export default PaymentsBuyer
