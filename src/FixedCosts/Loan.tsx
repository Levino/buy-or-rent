import * as React from 'react'
import { Component } from 'react'
import { Card, CardBody, CardTitle, Table } from 'reactstrap'
import {
  Equity, GrossPrice, Loan
} from '../selectors'
const TableRow = ({ title, Content, result }: { title: string, Content: any, result?: boolean }) => (<tr>
  <td style={{ fontWeight: result ? 'bold' : 'normal' }} scope="row" key="title">{title}</td>
  <td style={{ textAlign: 'right', fontWeight: result ? 'bold' : 'normal' }} key="amount"><Content /></td>
</tr>)

class LoanOverview extends Component {
  public render() {
    const entries = [
      {
        Content: GrossPrice,
        title: 'Bruttopreis',
      },
      {
        Content: Equity,
        title: 'Eigenkapital',
      },
      {
        Content: Loan,
        result: true,
        title: 'Kredithöhe',
      },
    ]
    const Content = () => (<Table responsive={true} size="sm">
      <thead>
        <tr>
          <th scope="col">Posten</th>
          <th style={{ textAlign: 'right' }} scope="col">Betrag</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, key) => <TableRow key={key} {...entry} />)}
      </tbody>
    </Table>)
    const Heading = () => <span>Kredit</span>
    return <Card>
      <CardBody>
        <CardTitle>
          <Heading key="heading" />
        </CardTitle>
        <Content key="content" />
      </CardBody>
    </Card>
  }
}

export default LoanOverview
