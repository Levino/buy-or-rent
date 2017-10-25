import React from 'react'
import {Row} from 'reactstrap';
import {
  AnnualLoanPayment,
  AnnualInvestmentPayment, MonthlyLoanPayment
} from './selectors'

const ListEntry = ({title, NumberComp}) => [
  <dt key="title" className="col-sm-3">{title}</dt>,
  <dd style={{textAlign: 'right'}}key="value" className="col-sm-9"><NumberComp/></dd>
]

const Result = ({annualPayment, netPrice, grossPrice, monthlyPayment, annualInvestmentPayment}) => {
  const entries = [
/*    {
      title: 'Nettopreis',
      value: moneyString(netPrice)
    },
    {
      title: 'Bruttopreis',
      value: moneyString(grossPrice)
    },*/
    {
      title: 'Jährliche Tilgungsrate',
      NumberComp: AnnualLoanPayment
    },
    {
      title: 'Monatliche Tilgungsrate',
      NumberComp: MonthlyLoanPayment
    },
    {
      title: 'Jährliche Investitionsrücklage',
      NumberComp: AnnualInvestmentPayment
    }
  ]
  return <Row>
    {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
  </Row>
}

export default Result
