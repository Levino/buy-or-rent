import * as React from 'react'
import DetailsTable from './DetailsTable'
import { Component } from 'react'
import { Row, Col } from 'reactstrap'

class DetailsTables extends Component {
  render() {
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
