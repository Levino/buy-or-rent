import { loanPaymentPerPeriod, restOfLoan } from '../helpers'

const createLoanData = () => {
  return {
    interestRate: 0.05,
    loanAmount: 20000,
    periods: 20,
    totalPeriods: 50
  }
}

describe('Helpers tests', () => {
  describe('Loan Payments tests', () => {
    it('should calculate the correct loan payments', () => {
      const payment = loanPaymentPerPeriod(createLoanData(), 1)
      expect(Math.round(payment * 100) / 100).toEqual(1604.85)
    })
    it('should calculate correct rest of loan after 1 period', () => {
      const payment = loanPaymentPerPeriod(createLoanData(), 1)
      expect(Math.round(restOfLoan(createLoanData(), 1) * 100) / 100).toEqual(
        Math.round((20000 * (1 + 0.05) - payment) * 100)/ 100
    })
  })
})
