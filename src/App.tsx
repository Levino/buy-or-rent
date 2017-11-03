import * as React from 'react'
import { Container, Row, Col } from 'reactstrap'
import DetailsTable from './DetailsTables'
import Form from './Form'
import Result from './Result/index'
import Head from 'next/head'
const App = () =>
      <Container fluid={true}>
        <Head>
          <meta charSet='utf-8' />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
            integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous"/>
        </Head>
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
        <Row>
          <Col>
            <DetailsTable />
          </Col>
        </Row>
      </Container>

export default App
