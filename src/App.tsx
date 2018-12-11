import 'bootstrap/dist/css/bootstrap.min.css'
import * as React from 'react'
import { Provider } from 'react-redux'
import { Col, Container, Row } from 'reactstrap'
import DetailsTable from './DetailsTables'
import FixedCosts from './FixedCosts/index'
import Form from './Form'
import Imprint from './Imprint'
import Intro from './Intro'
import Scenarios from './Scenarios'
import { configureStore } from './store'

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Container>
      <Intro />
      <Row>
        <Col>
          <h3>Die Szenarien</h3>
        </Col>
      </Row>
      <Scenarios />
      <Row>
        <Col style={{ padding: '1em' }} xs={12} sm={12} md={6}>
          <Row>
            <Col>
              <h3>Parameter</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form />
            </Col>
          </Row>
        </Col>
        <Col style={{ padding: '1em' }} xs={12} sm={12} md={6}>
          <Row>
            <Col>
              <h3>Fixkosten</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <FixedCosts />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <DetailsTable />
        </Col>
      </Row>
      <Row>
        <Col>
          <Imprint />
        </Col>
      </Row>
    </Container>
  </Provider>
)

export default App
