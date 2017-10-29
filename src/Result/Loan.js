import React from 'react'
import {
  NetPrice, GrossPrice, AbsolutePropertyPurchaseTax,
  AbsoluteBrokerFee, AbsoluteNotaryFee, Equity, Loan
} from '../selectors'

const ListEntry = ({title, Component, result}) => [
  result && <hr style={{width: '100%', margin: 0, borderTop: '2px solid black'}} key="line"/>,
  <dt key="title" className="col-md-8">{title}</dt>,
  <dd style={{textAlign: 'right', fontWeight: result ? 'bold' : undefined}} key="value" className="col-md-4"><Component/></dd>
]

const PurchaseCost = () => {
  const entries = [
    {
      title: 'Bruttopreis',
      Component: GrossPrice
    },
    {
      title: 'Eigenkapital',
      Component: Equity
    },
    {
      title: 'Kredithöhe',
      Component: Loan,
      result: true
    }
  ]
  const Content = () => <dl className="row">
    {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
  </dl>
  const Heading = () => <h3>Kredit</h3>
  return [
    <Heading key="heading"/>,
    <Content key="content"/>
  ]
}

export default PurchaseCost
