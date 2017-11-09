import * as React from 'react'
import { Row, Col } from 'reactstrap'
import PurchaseCost from './PurchaseCost'
import Loan from './Loan'
import PaymentsBuyer from './PaymentsBuyer'
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
