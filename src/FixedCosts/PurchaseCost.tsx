import * as React from 'react'
import { Table, Card, CardBlock, CardTitle } from 'reactstrap'
import {
  NetPrice, GrossPrice, AbsolutePropertyPurchaseTax,
  AbsoluteBrokerFee, AbsoluteNotaryFee
} from '../selectors'
import { Component } from 'react'

const TableRow = ({title, Content, result}: {title: string, Content: any, result?: boolean}) => (<tr>
  <td style={{fontWeight: result ? 'bold' : 'normal' }} scope="row" key="title">{title}</td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="amount"><Content/></td>
</tr>)

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
    const Content = () => (<Table responsive={true} size="sm">
        <thead>
        <tr>
          <th scope="col">Posten</th>
          <th style={{textAlign: 'right'}} scope="col">Betrag</th>
        </tr>
        </thead>
        <tbody>
        {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
        </tbody>
      </Table>)
    const Heading = ():any => `Kaufkosten`
    return <Card>
      <CardBlock>
        <CardTitle>
          <Heading key="heading"/>
        </CardTitle>
      <Content key="content"/>
      </CardBlock>
    </Card>
  }
}

export default PurchaseCost
