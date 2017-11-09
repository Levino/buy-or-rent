import * as React from 'react'
import { Row, Col } from 'reactstrap'

const Imprint = () => (
  <Row><Col style={{marginTop: '4em', textAlign: 'center'}}>
    <h3>Impressum</h3>
    <p><b>Angaben nach § 5 TMG:</b><br/>
      Hardfork UG (haftungsbeschränkt)<br/>
      Krossener Straße 8<br/>
      10245 Berlin</p>
    <p><strong>Vertreten durch:</strong><br/>
      Geschäftsführer Levin Keller<br/>
      <span style={{textDecoration: 'underline'}}>Contact:</span><br/>
      Phone: +4915156041082<br/>
      E-mail: contact@hardfork.io</p>
    <p><strong>Registriert: </strong><br/>
      Im Handelsregister.<br/>
      Registergericht: Berlin Charlottenburg<br/>
      Handelsregisternummer: HRB 162146 B</p>
    <p><strong>Verantwortlich für die Inhalte nach § 55 Abs. 2 RStV: </strong><br/>
      Levin Keller<br/>
      Krossener Straße 8<br/>
      10245 Berlin
    </p>
  </Col>
  </Row>
)

export default Imprint
