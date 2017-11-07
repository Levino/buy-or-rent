import * as React from 'react'
import { Container, Row, Col } from 'reactstrap'
import DetailsTable from './DetailsTables'
import Form from './Form'
import Result from './Result/index'
import Head from 'next/head'
import Intro from './Intro'
import Scenarios from './Scenarios'
const App = () =>
      <Container>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
          />
        </Head>
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
