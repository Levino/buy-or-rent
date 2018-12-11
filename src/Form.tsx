import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, FormGroup, InputGroup, InputGroupAddon, Label, Row } from 'reactstrap'
import { Field, reduxForm } from 'redux-form'
import { actions } from './sagas'

interface CustomFormGroupProps {
  addon?: string
  name: string
  label: string
  step?: string

  parse?(...args: Array<{}>): {}

  format?(...args: Array<{}>): {}
}

const CustomFormGroup = ({ addon, name, label, step = '0.1', parse, format }: CustomFormGroupProps) => {
  return (
    <FormGroup>
      <Label className="control-label" htmlFor={label}>{label}</Label>
      <div className="controls">
        <InputGroup>
          {addon && <InputGroupAddon addonType="prepend">{addon}</InputGroupAddon>}
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
        </InputGroup>
      </div>
    </FormGroup>
  )
}

const percentParsing = {
  format: value => Math.round(100000 * value) / 1000,
  parse: value => Math.round(Number(value) * 1000) / 100000,
}

const interestRateParsing = {
  format: value => Math.round(100000 * value * 12) / 1000,
  parse: value => Math.round(Number(value) * 1000) / 100000 / 12,
}

const yearParsing = {
  format: value => Math.round(value / 12),
  parse: value => 12 * value,
}

const numberParsing = {
  parse: value => Number(value),
}

const MainForm = ({ handleSubmit, calculating }) => (
  <Form>
    <Row>
      <Col md={6}>
        <CustomFormGroup addon="%" label="Kreditzins" {...interestRateParsing} name="interestRate" />
        <CustomFormGroup addon="%" label="Abgeltungssteuer" {...percentParsing} name="capGainsTax" />
        <CustomFormGroup addon="€" label="Eigenkapital" {...numberParsing} step="10000" name="equity" />
        <CustomFormGroup addon="€ pro m²" label="Kaltmiete" step="0.5" name="rentPricePerSM" />
        <CustomFormGroup addon="€ pro m²" label="Kaufpreis" step="100" name="buyPricePerSM" />
        <CustomFormGroup addon="m²" label="Größe" name="size" />
        <CustomFormGroup
          addon="% pro Jahr"
          {...interestRateParsing}
          label="Investitionsrücklage"
          name="investmentReserve"
        />
      </Col>
      <Col md={6}>
        <CustomFormGroup addon="Jahre" step="5" label="Laufzeit" name="periods" {...yearParsing} />
        <CustomFormGroup addon="Jahre" step="5" label="Restliche Lebenszeit"  {...yearParsing} name="timeToDeath" />
        <CustomFormGroup addon="%" {...percentParsing} step="0.1" label="Notarkosten" name="notaryFee" />
        <CustomFormGroup addon="%" step="0.5" {...percentParsing} label="Grunderwerbsteuer" name="propertyPurchaseTax" />
        <CustomFormGroup addon="%" step="1.19" {...percentParsing} label="Maklergebühr" name="brokerFee" />
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
    calculating: state.calculating,
  }
}

const Wrapper = connect(
  mapStateToProps
)(MainForm)

export default reduxForm({
  form: 'mainForm',
  onSubmit: (values, dispatch) => {
    dispatch(actions.calculateEquivYield(values))
  },
})(Wrapper)
