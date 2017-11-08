import memoize from 'memoizee'

export type BuyerData = {
  buyPricePerSM: number
  size: number
  brokerFee: number
  notaryFee: number
  propertyPurchaseTax: number
  yieldPerPeriod: number
  investmentReserve: number
  equity: number
}

export type StockData = {
  equity: number
  stockIncreasePerPeriod: number
}

export type TaxData = {
  capGainsTax: number
}

export type RentData = {
  size: number,
  rentPricePerSM: number,
  rentIncreasePerPeriod: number
}

export type LoanData = {
  periods: number
  interestRate: number
}

export type theData = {
  stockData: StockData
  rentData: RentData,
  buyerData: BuyerData,
  taxData: TaxData,
  loanData: LoanData,
  totalPeriods?: number
}

export const loanAmount = (data: theData): number => {
  const { buyerData: {
    size,
    brokerFee,
    notaryFee,
    propertyPurchaseTax,
    equity,
    buyPricePerSM
  } } = data
  return size * buyPricePerSM * ( 1 + brokerFee + notaryFee + propertyPurchaseTax) - equity
}

export const PMT = memoize((rate, nper, pv, fv = 0, type = 0) => {
  if (rate === 0) {
    return -(pv + fv) / nper
  }

  const pvif = Math.pow(1 + rate, nper)
  let pmt = rate / (pvif - 1) * -(pv * pvif + fv)

  if (type === 1) {
    pmt /= (1 + rate)
  }
  return pmt
})

export const loanPaymentPerPeriod = (data: theData, period: number) => {
  const {
    loanData: {
      periods,
      interestRate
    }
  } = data
  let loanPayment
  if (period < periods) {
    loanPayment = -1 * PMT(interestRate, periods, loanAmount(data))
  } else {
    loanPayment = 0
  }
  return loanPayment
}

export const calculateEquivalentYield = memoize(async (data: theData) => {
  let upperLimit = 1 / 12
  let lowerLimit = 0
  let error = 1
  let approximationValue
  let safety = 0
  const iteration = async () => {
    return new Promise((resolve, reject) => {
      approximationValue = (upperLimit + lowerLimit) / 2
      const periods = calculatePeriods({
        ...data,
        stockData: {
          ...data.stockData,
          stockIncreasePerPeriod: approximationValue
        }
      })
      const netWorthBuyer = periods[data.totalPeriods].buyerData.networth
      const netWorthTenant = periods[data.totalPeriods].tenantData.stockValue
      error = netWorthTenant - netWorthBuyer
      console.log(error)
      if (error > 0) {
        upperLimit = approximationValue
      } else {
        lowerLimit = approximationValue
      }
      ++safety
      if (safety > 10000) {
        return reject('Approximation failed!')
      }
      setTimeout(resolve, 0)
    })
  }

  do {
    await iteration()
  } while (Math.abs(error) > 0.001)
  return approximationValue
}, {promise: true})

const investmentPayment = (data: theData) => {
  const {
    buyerData: {
      buyPricePerSM,
      size,
      investmentReserve
    }
  } = data
  return (buyPricePerSM * size) * investmentReserve
}

export type Period = {
  buyerData: {
    loanAmount: number
    totalPayments: number
    totalInterest: number
    propertyValue: number
    networth: number
  }
  tenantData: {
    totalRent: number
    totalSavings: number
    totalStockValueIncrease: number
    totalTax: number
    stockValue: number
  }
}

export type PeriodsArray = {
  [key: number]: Period
}

export const calculatePeriods = (data: theData): PeriodsArray => {
  const {
    stockData: {
      equity,
      stockIncreasePerPeriod
    },
    taxData: {
      capGainsTax
    },
    loanData: {
      periods,
      interestRate
    },
    buyerData: {
      buyPricePerSM,
      size,
      yieldPerPeriod
    },
    rentData: {
      rentPricePerSM,
      rentIncreasePerPeriod
    },
    totalPeriods
  } = data
  let result = {}
  let stockValue = equity
  let initialPropertyValue = size * buyPricePerSM
  let totalLoanAmount = loanAmount(data)
  let i
  let totalRent = 0
  let totalSavings = 0
  let totalStockValueIncrease = 0
  let totalTax = 0
  let totalPayments = 0
  let totalInterest = 0
  for (i = 0; i <= totalPeriods; ++i) {
    /* Values at the beginning of the period */
    // Value of property at beginning of period
    const propertyValue = initialPropertyValue * Math.pow(1 + yieldPerPeriod, i)

    // Networth at beginning of period
    const networth = propertyValue - totalLoanAmount
    result = {
      ...result,
      [i]: {
        buyerData: {
          loanAmount: totalLoanAmount,
          totalPayments,
          totalInterest,
          propertyValue,
          networth,
        },
        tenantData: {
          totalRent,
          totalSavings,
          totalStockValueIncrease,
          totalTax,
          stockValue
        }
      }
    }

    /* Calculating changes in values over the period */

    /* Buyer data */

    // Payment of buyer in period
    const paymentsBuyer = loanPaymentPerPeriod(data, i) + investmentPayment(data)

    // Aggregated Payments buyer
    totalPayments += paymentsBuyer

    // Interest in period
    const interest = (i <= periods) ? totalLoanAmount * interestRate : 0

    // Aggregated interest
    totalInterest += interest

    // Update total loan amount
    totalLoanAmount += interest - loanPaymentPerPeriod(data, i)

    /* Tenant data */

    // Rent in period
    const rent = size * rentPricePerSM * Math.pow(1 + rentIncreasePerPeriod, i)

    // Aggregated rent
    totalRent += rent

    // Savings in period
    const savings = paymentsBuyer - rent

    // Aggregated savings

    totalSavings += savings

    // Stock return on investment (before taxes) in period
    const stockGainBeforeTax = stockValue * stockIncreasePerPeriod

    // Tax in period
    const tax = stockGainBeforeTax * capGainsTax

    totalTax += tax

    // Stock value increase in period
    const stockValueIncrease = stockGainBeforeTax - tax + savings

    // Aggregated stock value increase
    totalStockValueIncrease += stockValueIncrease

    stockValue += stockValueIncrease

  }
  return result
}
