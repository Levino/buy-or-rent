import * as React from 'react';
import {Component} from 'react';

class MoneyString extends Component<{value: number}>  {
    render() {
        const { value } = this.props
        return <span>{`${(Math.round(value * 100) / 100).toLocaleString('de', { currency: 'EUR', minimumFractionDigits: 2 })} €`}</span>
    }
}

export { MoneyString }
