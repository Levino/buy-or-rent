import * as React from 'react'
import { Row, Col } from 'reactstrap'
import PurchaseCost from './PurchaseCost'
import Loan from './Loan'
import PaymentsBuyer from './PaymentsBuyer'
import EquivalentYield from './EquivalentYield'
const Result = () => (
  <Row><Col md={6}>
    <PurchaseCost/>
    <Loan/>
  </Col><Col md={6}>
    <PaymentsBuyer/>
    <EquivalentYield/>
  </Col></Row>
)

export default Result
