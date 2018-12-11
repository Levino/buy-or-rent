import * as React from 'react'
import { Col, Row } from 'reactstrap'
import Loan from './Loan'
import PaymentsBuyer from './PaymentsBuyer'
import PurchaseCost from './PurchaseCost'
const Result = () => (
  <Row><Col md={12}>
    <PurchaseCost/>
    <Loan/>
    <PaymentsBuyer/>
  </Col>
    <style>{`
          .card {
            margin-bottom: 1em;
          }
        `}</style>
  </Row>
)

export default Result
