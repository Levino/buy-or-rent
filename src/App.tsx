import * as React from 'react'
import { Container, Row, Col } from 'reactstrap'
import DetailsTable from './DetailsTables'
import Form from './Form'
import Result from './Result/index'
import Head from './Head'
import Intro from './Intro'
import Scenarios from './Scenarios'
const App = () =>
      <Container>
        <Head />
        <Intro />
        <Scenarios />
        <Row>
          <Col style={{padding: '1em'}} md={4}>
            <Form/>
          </Col>
          <Col style={{padding: '1em'}} md={8}>
            <Result/>
          </Col>
        </Row>
        <Row>
          <Col>
            <DetailsTable />
          </Col>
        </Row>
      </Container>

export default App
