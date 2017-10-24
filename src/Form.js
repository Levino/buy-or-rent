import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Row, Col, Button, Form, FormGroup, Label, InputGroup, InputGroupAddon, FormText} from 'reactstrap';

const CustomFormGroup = ({ addon, name, label }) => (
  <FormGroup>
    <Label htmlFor={label}>{label}</Label>
    <InputGroup>
      <Field name={name} className="form-control" component="input" type="number"/>
      {addon && <InputGroupAddon>{addon}</InputGroupAddon>}
    </InputGroup>
  </FormGroup>
)

const MainForm = () => (
  <Form>
    <Row>
      <Col md={6}>
        <CustomFormGroup addon="%" label="Kreditzins" name="interestRate"/>
        <CustomFormGroup addon="%" label="Abgeltungssteuer" name="capGainsTax"/>
        <CustomFormGroup addon="€" label="Eigenkapital" name="equity"/>
        <CustomFormGroup addon="€ pro m²" label="Kaltmiete" name="rentPricePerSM"/>
        <CustomFormGroup addon="€ pro m²" label="Kaufpreis" name="buyPricePerSM"/>
      </Col>
      <Col>
        <CustomFormGroup addon="% pro Jahr" label="Investitionsrücklage" name="investmentReserve"/>
      </Col>
    </Row>
  </Form>
)

export default reduxForm({
  form: 'mainForm',
  initialValues: {
  interestRate: 2,
  capGainsTax: 25,
  equity: 200000,
  rentPricePerSM: 14,
  buyPricePerSM: 4000
}
})(MainForm)
