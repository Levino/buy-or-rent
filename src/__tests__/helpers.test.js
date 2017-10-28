import {loanPayments, monthlyLoanPayment} from "../helpers"

describe('Helpers tests', () => {
  describe('Loan Payments tests', () => {
    it('should calculate the correct loan payments', () => {
      const years = 1
      const payment = monthlyLoanPayment({interestRate: 0.02, loan: 500000, years})
      expect(Math.round(payment*100)/100).toEqual(42119.43)
    })
  })
  describe('loanPayments tests', () => {
    it('should generate an array of yearly loan payments that reduce the loan to 0 at the end of the last year', () => {
      const years = 20
      const loanPaymentsArray = loanPayments({interestRate: 0.02, loan: 500000, years})
      expect(loanPaymentsArray[years - 1].loanAtEnd).toEqual(0)
    })
  })
})
