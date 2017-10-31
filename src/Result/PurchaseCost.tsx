import * as React from 'react'
import { Row, Col } from 'reactstrap'
import {
  NetPrice, GrossPrice, AbsolutePropertyPurchaseTax,
  AbsoluteBrokerFee, AbsoluteNotaryFee
} from '../selectors'
import { Component } from 'react'

interface ListEntryInterface {
  title: string
  Content: any
  result?: boolean
}

class ListEntry extends Component<ListEntryInterface> {
  render() {
    const {title, Content, result} = this.props
    return [
      result && <hr style={{width: '100%', margin: 0, borderTop: '2px solid black'}} key="line"/>,
      <dt key="title" className="col-md-8">{title}</dt>,
      (
        <dd style={{textAlign: 'right', fontWeight: result ? 'bold' : undefined}} key="value" className="col-md-4">
          <Content/>
        </dd>
      )
    ]
  }
}

class PurchaseCost extends Component {
  render() {
    const entries = [
      {
        title: 'Nettopreis',
        Content: NetPrice
      },
      {
        title: 'Grunderwerbsteuer',
        Content: AbsolutePropertyPurchaseTax
      },
      {
        title: 'Maklercourtage',
        Content: AbsoluteBrokerFee
      },
      {
        title: 'Notargebühren',
        Content: AbsoluteNotaryFee
      },
      {
        title: 'Bruttopreis',
        Content: GrossPrice,
        result: true
      }
    ]
    const Content = () => (<Row><Col>
      <dl className="row">
        {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
      </dl>
    </Col></Row>)
    const Heading = () => <h3>Kaufkosten</h3>
    return [
      <Heading key="heading"/>,
      <Content key="content"/>
    ]
  }
}

export default PurchaseCost
