import * as React from 'react'
import { Component } from 'react'
import { Col, Row } from 'reactstrap'
import DetailsTable from './DetailsTable'

class DetailsTables extends Component {
  public render() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>Berechnungsdetails</Col>
          </Row>
          <Row>
            <Col><DetailsTable key="years"/></Col>
          </Row>
          <Row><Col>
            <DetailsTable format="months" key="months"/>
          </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
export default DetailsTables
