import React from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'reactstrap';
import {annualPayment, grossPrice, netPrice} from './selectors'

const ListEntry = ({title, value}) => [
  <dt key="title" className="col-sm-3">{title}</dt>,
  <dd key="value" className="col-sm-9">{value}</dd>
]

const Result = ({annualPayment, netPrice, grossPrice}) => {
  const entries = [
    {
      title: 'Nettopreis',
      value: netPrice
    },
    {
      title: 'Bruttopreis',
      value: grossPrice
    },
    {
      title: 'Jährliche Belastung',
      value: annualPayment
    }
  ]
  return <Row>
    {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
  </Row>
}

const mapStateToProps = state => {
  return {
    annualPayment: annualPayment(state),
    netPrice: netPrice(state),
    grossPrice: grossPrice(state)
  }
}

export default connect(mapStateToProps)(Result)
