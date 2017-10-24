import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap'
import logo from './logo.svg';
import './App.css';
import Form from './Form'
import Result from './Result'
class App extends Component {
  render () {
    return (
      <Container fluid>
        <Row>
          <Col>
            <h3>Kaufen oder mieten?</h3>
            <p>Berechnen Sie, ob Sie lieber kaufen oder mieten sollten.</p>
          </Col>
        </Row>
        <Row>
          <Col style={{padding: '1em'}} md={4}>
            <Form/>
          </Col>
          <Col style={{padding: '1em'}} md={8}>
            <Result/>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App;
