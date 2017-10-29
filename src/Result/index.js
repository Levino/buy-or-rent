import React from 'react'
import { Row, Col } from 'reactstrap'
import PurchaseCost from './PurchaseCost'
import Loan from './Loan'
import Payments from './Payments'

const Result = () => {
  return <Row><Col md={6}>
    <PurchaseCost key={1}/>
    <Loan key="loan"/>
  </Col><Col md={6}>
    <Payments key="payments"/>
  </Col></Row>
}

export default Result
