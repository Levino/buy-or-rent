import * as React from 'react'
import { Row, Col, Card, CardBlock, CardTitle, CardText } from 'reactstrap'
import {
  NetPrice, PropertySize, GrossPrice, LoanAmount, LoanYears, AnnualInvestmentPayment,
  PropertyValueIncreasePerYear, MonthlyInvestmentPayment, MonthlyPaymentBuyer, YearsToDeath,
  PropertyEndValue
} from './selectors'

const Scenarios = () => {
  return <Row>
    <Col md={6}>
      <Card>
        <CardBlock>
          <CardTitle>
            Käufer
          </CardTitle>
          <CardText>
            Sie kaufen heute eine Immobilie mit einer Fläche von <PropertySize/> im Wert von <NetPrice/> um darin zu
            wohnen.
            Dafür müssen Sie inklusive Transaktionskosten einen Kaufpreis von <GrossPrice/> bezahlen. Sie nehmen also
            einen Kredit
            über <LoanAmount/> auf und investieren <AnnualInvestmentPayment/> im Jahr in die Instandhaltung der
            Immobilie.
            Mit monatlichen Zahlungen von <MonthlyPaymentBuyer/> haben Sie den Kredit nach <LoanYears/> Jahren abbezahlt
            und die monatlichen Zahlungen verringern sich auf <MonthlyInvestmentPayment/> bis zu Ihrem Tod
            in <YearsToDeath/> Jahren.
            Bei einem Wertzuwachs der Immobile von <PropertyValueIncreasePerYear/> pro Jahr vererben Sie dann ein
            abbezahltes Haus
            im Wert von <PropertyEndValue/>
          </CardText>
        </CardBlock>
      </Card>
    </Col>
    <Col md={6}>
      <Card>
        <CardBlock>
          <CardTitle>
            Mieter
          </CardTitle>
          <CardText>
            Wurst
          </CardText>
        </CardBlock>
      </Card>
    </Col>
  </Row>
}

export default Scenarios
