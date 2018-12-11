import * as React from 'react'
import { Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap'
import {
  Equity,
  EquivalentRate,
  GrossPrice,
  LoanAmount,
  LoanYears,
  MonthlyInvestmentPayment,
  MonthlyLoanPayment,
  MonthlyPaymentBuyer,
  NetPrice,
  PropertyEndValue,
  PropertySize,
  RentIncreasePerYear,
  RentPerMonth,
  StockEndValue,
  YearsToDeath
} from './selectors'

const Scenarios = () => {
  return (
    <Row>
      <Col xs={12} sm={12} md={6}>
        <Card>
          <CardBody>
            <CardTitle>Käufer</CardTitle>
            <CardText>
              Sie haben ein Startkapital von <Equity /> und kaufen heute eine
              Immobilie mit einer Fläche von <PropertySize /> im Wert von{' '}
              <NetPrice /> um darin zu wohnen. Dafür müssen Sie inklusive
              Transaktionskosten einen Kaufpreis von <GrossPrice /> bezahlen.
              Sie nehmen also einen Kredit über <LoanAmount /> auf, welchen Sie
              mit monatlichen Tilgungsraten von <MonthlyLoanPayment /> nach{' '}
              <LoanYears /> Jahren abbezahlt haben. Außerdem müssen Sie jeden
              Monat <MonthlyInvestmentPayment /> in die Instandhaltung der
              Immobilie investieren. Sie zahlen also die ersten <LoanYears />{' '}
              Jahre <MonthlyPaymentBuyer /> und danach bis zu Ihrem Tod{' '}
              <MonthlyInvestmentPayment /> pro Monat. Dafür können sich Ihre
              Erben in <YearsToDeath /> Jahren auf eine schuldenfreie Immobilie
              im Wert von von <PropertyEndValue /> freuen.
            </CardText>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card>
          <CardBody>
            <CardTitle>Mieter</CardTitle>
            <CardText>
              Sie haben ein Startkapital von <Equity /> welches Sie zum Beispiel
              in Aktien anlegen. Sie wohnen zur Miete in einer Immobilie mit{' '}
              <PropertySize /> und zahlen dafür im ersten Jahr <RentPerMonth />{' '}
              Kaltmiete pro Monat welche um <RentIncreasePerYear /> pro Jahr
              steigt. Sie wenden monatlich die ersten <LoanYears /> Jahre{' '}
              <MonthlyPaymentBuyer /> und danach bis zu Ihrem Tod{' '}
              <MonthlyInvestmentPayment /> auf. Davon bezahlen Sie Ihre Miete
              und den Betrag der übrig bleibt legen Sie genau wie das
              Startkapital an bzw. entnehmen den Fehlbetrag zur Miete aus dem
              angelegten Kapital. Wenn Ihre Anlageform eine Rendite von{' '}
              <EquivalentRate /> pro Jahr erziehlt und Sie nach <YearsToDeath />{' '}
              Jahren sterben, können sich Ihre Erben über ein versteuertes
              Aktienpaket im Wert von <StockEndValue /> freuen.
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default Scenarios
