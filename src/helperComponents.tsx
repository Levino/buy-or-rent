export const moneyString = number => {
    if (!number) {
        number = 0
    }
    return `${(Math.round(number * 100) / 100).toLocaleString('de', { currency: 'EUR', minimumFractionDigits: 2 })} €`
}
