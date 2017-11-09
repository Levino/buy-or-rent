import * as React from 'react'
import {
  GrossPrice, Equity, Loan
} from '../selectors'
import { Card, CardTitle, CardBlock, Table } from 'reactstrap'
import { Component } from 'react'
const TableRow = ({title, Content, result}) => (<tr>
  <td style={{fontWeight: result ? 'bold' : 'normal' }} scope="row" key="title">{title}</td>
  <td style={{textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="amount"><Content/></td>
</tr>)

class LoanOverview extends Component {
  render () {
    const entries = [
      {
        title: 'Bruttopreis',
        Content: GrossPrice
      },
      {
        title: 'Eigenkapital',
        Content: Equity
      },
      {
        title: 'Kredithöhe',
        Content: Loan,
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
    const Heading = () => <span>Kredit</span>
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

export default LoanOverview
