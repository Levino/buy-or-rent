import React from 'react'
import { Row, Col } from 'reactstrap'
import PurchaseCost from './PurchaseCost'
import Loan from './Loan'
import PaymentsBuyer from './PaymentsBuyer'
const Result = () => {
  return <Row><Col md={6}>
    <PurchaseCost/>
    <Loan/>
  </Col><Col md={6}>
    <PaymentsBuyer/>
  </Col></Row>
}

export default Result
