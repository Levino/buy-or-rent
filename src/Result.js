import React from 'react'
import {Row} from 'reactstrap';
import {
  AnnualLoanPayment,
  AnnualInvestmentPayment, MonthlyLoanPayment, NetPrice, GrossPrice, YearlyPaymentBuyer
} from './selectors'

const ListEntry = ({title, Component}) => [
  <dt key="title" className="col-sm-3">{title}</dt>,
  <dd style={{textAlign: 'right'}} key="value" className="col-sm-9"><Component/></dd>
]

const Result = () => {
  const entries = [
    {
      title: 'Nettopreis',
      Component: NetPrice
    },
    {
      title: 'Bruttopreis',
      Component: GrossPrice
    },
    {
      title: 'Jährliche Tilgungsrate',
      Component: AnnualLoanPayment
    },
    {
      title: 'Monatliche Tilgungsrate',
      Component: MonthlyLoanPayment
    },
    {
      title: 'Jährliche Investitionsrücklage',
      Component: AnnualInvestmentPayment
    },
    {
      title: 'Jährliche Belastung Kauf',
      Component: YearlyPaymentBuyer
    }
  ]
  return <Row>
    {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
  </Row>
}

export default Result
