import * as React from 'react'
import { Row, Col } from 'reactstrap'
const Intro = () => (
  <Row className="d-flex justify-content-center">
    <Col md={12} lg={8} xl={6}>
      <h3 style={{textAlign: 'center'}}>Kaufen oder mieten?</h3>
      <p>Hier können Sie herausfinden, ob Sie lieber kaufen oder mieten sollten. Dafür betrachten
      wir zwei Szenarien: Entweder Sie nehmen einen Kredit auf und kaufen ein Eigenheim oder Sie legen Ihr Geld jeden Monat
      an. Wir berechnen für Sie, welche Rendite ihre Anlage benötigt um am Ende in beiden Fällen das gleiche Vermögen zu
      vererben.</p>
      <p>
        Wir präsentieren zunächst eine Zusammenfassung der beiden Szenarien in Textform. Darunter können Sie die zugrunde gelegten
        Werte anpassen und Ihrer Situation und Markterwartung anpassen. Danach klicken Sie bitte auf "berechnen" um die
        Szenarien zu aktualisieren.
      </p>
      <p>
        Im letzten Abschnitt sehen Sie detaillierte Tabellen mit einem jährlichen Überblick über die Entwicklung
        der finanziellen Situation in beiden Szenarien. Zur Plausibilisierung sind auch die ersten 24 Monate im Detail dargestellt.
      </p>
    </Col>
</Row>
)

export default Intro
