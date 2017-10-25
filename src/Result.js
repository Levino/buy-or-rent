import React from 'react'
import {connect} from 'react-redux'
import {Row} from 'reactstrap';
import {AnnualLoanPayment, grossPrice, netPrice, monthlyLoanPayment, annualInvestmentPayment} from './selectors'

const ListEntry = ({title, NumberComp}) => [
  <dt key="title" className="col-sm-3">{title}</dt>,
  <dd key="value" className="col-sm-9"><NumberComp/></dd>
]

const moneyString = number => `${number.toLocaleString('de', { currency: 'EUR'})} €`

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
    }/*,
    {
      title: 'Monatliche Tilgungsrate',
      value: moneyString(monthlyPayment)
    },
    {
      title: 'Jährliche Investitionsrücklage',
      value: annualInvestmentPayment
    }*/
  ]
  return <Row>
    {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
  </Row>
}

const mapStateToProps = state => {
  return {
    netPrice: netPrice(state),
    grossPrice: grossPrice(state),
    monthlyPayment: monthlyLoanPayment(state),
    annualInvestmentPayment: annualInvestmentPayment(state)
  }
}

export default connect(mapStateToProps)(Result)
