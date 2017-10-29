import * as React from 'react';
import {Row, Col} from 'reactstrap';
import {
    NetPrice, GrossPrice, AbsolutePropertyPurchaseTax,
    AbsoluteBrokerFee, AbsoluteNotaryFee
} from '../selectors';

const ListEntry: any = ({title, Component, result}) => [
    result && <hr style={{width: '100%', margin: 0, borderTop: '2px solid black'}} key="line"/>,
    <dt key="title" className="col-md-8">{title}</dt>,
    <dd style={{textAlign: 'right', fontWeight: result ? 'bold' : undefined}} key="value" className="col-md-4">
        <Component/></dd>
];

const PurchaseCost: any = () => {
    const entries = [
        {
            title: 'Nettopreis',
            Component: NetPrice
        },
        {
            title: 'Grunderwerbsteuer',
            Component: AbsolutePropertyPurchaseTax
        },
        {
            title: 'Maklercourtage',
            Component: AbsoluteBrokerFee
        },
        {
            title: 'Notargebühren',
            Component: AbsoluteNotaryFee
        },
        {
            title: 'Bruttopreis',
            Component: GrossPrice,
            result: true
        }
    ];
    const Content: any = () => (<Row><Col>
        <dl className="row">
            {entries.map((entry, key) => <ListEntry key={key} {...entry} />)}
        </dl>
    </Col></Row>);
    const Heading : any = () => <h3>Kaufkosten</h3>
    return [
        <Heading key="heading"/>,
        <Content key="content"/>
    ];
};

export default PurchaseCost;
