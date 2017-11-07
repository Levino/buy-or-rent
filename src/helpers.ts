import memoize from 'memoizee'

export type loanDataType = {
  periods: number
  loanAmount: number
  interestRate: number,
  totalPeriods: number
}

export type AssetData = {
  equity: number
  yieldPerPeriod: number
  investmentReserve: number
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

export type theData = {
  stockData: StockData
  rentData: RentData,
  loanData: loanDataType,
  taxData: TaxData,
  assetData: AssetData
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
      interestRate,
      loanAmount
    }
  } = data
  let loanPayment
  if (period < periods) {
    loanPayment = -1 * PMT(interestRate, periods, loanAmount)
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
      const periods = calculateAllValues({
        ...data,
        stockData: {
          ...data.stockData,
          stockIncreasePerPeriod: approximationValue
        }
      })
      const netWorthBuyer = periods[data.loanData.totalPeriods].buyerData.networth
      const netWorthTenant = periods[data.loanData.totalPeriods].tenantData.stockValue
      error = netWorthTenant - netWorthBuyer
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
    assetData: {
      equity,
      investmentReserve
    }
  } = data
  return equity * investmentReserve
}

export const calculateAllValues = (data: theData) => {
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
      totalPeriods,
      loanAmount,
      interestRate
    },
    assetData: {
      equity: propertyEquity,
      yieldPerPeriod
    },
    rentData: {
      rentPricePerSM,
      size,
      rentIncreasePerPeriod
    }
  } = data
  let result = {}
  let stockValue = equity
  let totalLoanAmount = loanAmount
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
    const propertyValue = propertyEquity * Math.pow(1 + yieldPerPeriod, i)

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
