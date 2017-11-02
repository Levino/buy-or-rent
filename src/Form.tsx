import * as React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col, Form, FormGroup, Label, InputGroup, InputGroupAddon, Button } from 'reactstrap'
import { actions } from './sagas'
import { connect } from 'react-redux'

interface ICustomFormGroup {
  addon?: {}
  name: string
  label: string
  step?: string

  parse?(...args: {}[]): {}

  format?(...args: {}[]): {}
}

const CustomFormGroup = ({addon, name, label, step = '0.1', parse, format}: ICustomFormGroup) => {
  return (
    <FormGroup>
      <Label className="control-label" htmlFor={label}>{label}</Label>
      <div className="controls">
        <InputGroup>
          <Field
            name={name}
            className="form-control"
            component="input"
            type="number"
            step={step}
            format={format}
            parse={parse}
            id={label}
          />
          {addon && <InputGroupAddon>{addon}</InputGroupAddon>}
        </InputGroup>
      </div>
    </FormGroup>
  )
}

const percentParsing = {
  parse: value => Math.round(Number(value) * 1000) / 100000,
  format: value => Math.round(100000 * value) / 1000
}

const interestRateParsing = {
  parse: value => Math.round(Number(value) * 1000) / 100000 / 12,
  format: value => Math.round(100000 * value * 12) / 1000
}

const yearParsing = {
  parse: value => 12 * value,
  format: value => Math.round(value / 12)
}

const MainForm = ({handleSubmit, calculating}) => (
  <Form>
    <Row>
      <Col md={6}>
        <CustomFormGroup addon="%" label="Kreditzins" {...interestRateParsing} name="interestRate"/>
        <CustomFormGroup addon="%" label="Abgeltungssteuer" {...percentParsing} name="capGainsTax"/>
        <CustomFormGroup addon="€" label="Eigenkapital" step="10000" name="equity"/>
        <CustomFormGroup addon="€ pro m²" label="Kaltmiete" step="0.5" name="rentPricePerSM"/>
        <CustomFormGroup addon="€ pro m²" label="Kaufpreis" step="100" name="buyPricePerSM"/>
        <CustomFormGroup addon="m²" label="Größe" name="size"/>
        <CustomFormGroup
          addon="% pro Jahr"
          {...interestRateParsing}
          label="Investitionsrücklage"
          name="investmentReserve"
        />
      </Col>
    <Col md={6}>
        <CustomFormGroup addon="Jahre" step="5" label="Laufzeit" name="periods" {...yearParsing}/>
        <CustomFormGroup addon="Jahre" step="5" label="Restliche Lebenszeit"  {...yearParsing} name="timeToDeath"/>
        <CustomFormGroup addon="%" {...percentParsing} step="0.1" label="Notarkosten" name="notaryFee"/>
        <CustomFormGroup addon="%" step="0.5" {...percentParsing} label="Grunderwerbsteuer" name="propertyPurchaseTax"/>
        <CustomFormGroup addon="%" step="1.19" {...percentParsing} label="Maklergebühr" name="brokerFee"/>
        <CustomFormGroup
          addon="% pro Jahr"
          {...interestRateParsing}
          label="Wertzuwachs Immobilie"
          name="equityPriceIncrease"
        />
        <CustomFormGroup
          addon="% pro Jahr"
          {...interestRateParsing}
          label="Mietsteigerung pro Jahr"
          name="rentIncreasePerPeriod"
        />
      </Col>
    </Row>
    <Button color="primary" className="float-right" disabled={calculating} onClick={handleSubmit}>Berechnen</Button>
  </Form>
)

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    calculating: state.periods.calculating || (state.equivalentRate.status === 'calculating')
  }
}

const Wrapper = connect(
  mapStateToProps
)(MainForm)

export default reduxForm({
  form: 'mainForm',
  onSubmit: (values, dispatch) => dispatch(actions.calculateEquivYield())
})(Wrapper)
