import { Component } from 'react'

class MoneyString extends Component<{value: number}>  {
    render() {
        const { value } = this.props
        return Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value)
    }
}

export { MoneyString }
