import * as React from 'react'
import { Row, Col, Table, Card, CardBlock, CardTitle } from 'reactstrap'
import {
  MonthlyLoanPayment, AnnualLoanPayment, AnnualInvestmentPayment,
  MonthlyInvestmentPayment, YearlyPaymentBuyer, MonthlyPaymentBuyer
} from '../selectors'

const TableRow = ({title, PerYear, PerMonth, result}: {title: string, PerYear: any, PerMonth, result?: boolean}) => <tr>
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
  const Content = () => (<Table responsive={true} size="sm">
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
    </Table>)
  const Heading = () => <span>Zahlungen Käufer Tilgungsphase</span>
  return (<Card>
    <CardBlock>
      <CardTitle>
        <Heading key="heading"/>
      </CardTitle>
      <Content key="content"/>
    </CardBlock>
  </Card>)
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
  const Content = ()  => <Table  responsive={true} size="sm">
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
  const Heading = ()  => <span>Zahlungen Käufer Sterbephase</span>
  return <Card>
    <CardBlock>
      <CardTitle>
        <Heading key="heading"/>
      </CardTitle>
      <Content key="content"/>
    </CardBlock>
  </Card>
}

const PaymentsBuyer = () => <Row><Col>
  <PaymentsRepaymentPeriod/>
</Col><Col>
  <PaymentsDyingPeriod/>
</Col></Row>

export default PaymentsBuyer
