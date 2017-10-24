import React from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'reactstrap';

const Result = ({interestRate}) => (
  <Row>
    <Col md={6}>
      {interestRate}
    </Col>
  </Row>
)

const mapStateToProps = state => state.form.mainForm.values

export default connect(mapStateToProps)(Result)
