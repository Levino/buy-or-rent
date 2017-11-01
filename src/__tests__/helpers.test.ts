import { loanPaymentPerPeriod, sum } from '../helpers'

describe('Helpers tests', () => {
    describe('Loan Payments tests', () => {
        it('should calculate the correct loan payments', () => {
            const periods = 1
            const payment = loanPaymentPerPeriod({interestRate: 0.02 / 12, loanAmount: 500000, periods: periods * 12})
            expect(Math.round(payment * 100) / 100).toEqual(42119.43)
        })
    })
    describe('sum tests', () => {
        it('should compute simple sum', () => {
            expect(sum(1, 10, (i) => i)).toEqual(55)
        })
        it('should compute a more complex sum', () => {
            expect(sum(1, 3, (i) => i * i)).toEqual(14)
        })
    })
})
