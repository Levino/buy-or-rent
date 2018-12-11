import * as React from 'react'

class MoneyString extends React.Component<{ value: number }> {
  public render() {
    const { value } = this.props
    return Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value)
  }
}

export { MoneyString }
