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
  if (period <= periods) {
    loanPayment = -1 * PMT(interestRate, periods, loanAmount)
  } else {
    loanPayment = 0
  }
  return loanPayment
}

const loanPaymentUntil = memoize((data: theData, period: number) => {
  const {
    assetData: {
      equity,
      investmentReserve
    }
  } = data
  let result = 0
  let i
  for (i = 1; i <= period; ++i) {
    result += loanPaymentPerPeriod(data, i) + equity * investmentReserve
  }
  return result
})

export const buyerPaymentsBetween = memoize((data: theData, fromPeriod: number, toPeriod: number) => {
  return loanPaymentUntil(data, toPeriod) - loanPaymentUntil(data, fromPeriod)
})

export const restOfLoan = memoize((data: theData,
                                   period: number): number => {
  const {
    loanAmount,
    interestRate,
    periods
  } = data.loanData
  let result = loanAmount
  let i
  for (i = 1; i <= period; ++i) {
    const paymentPerPeriod = PMT(interestRate, periods, loanAmount)
    result += result * (interestRate) + paymentPerPeriod
    if (i >= periods) {
      break
    }
  }
  return result
})

export const assetValuation = memoize((data: theData, period: number): number => {
  const {
    equity,
    yieldPerPeriod
  } = data.assetData
  let result = equity
  let i
  for (i = 1; i <= period; ++i) {
    result *= (1 + yieldPerPeriod)
  }
  return result
})

const interestUntil = memoize((data: theData, period: number) => {
  let result = data.loanData.interestRate * data.loanData.loanAmount
  let i
  for (i = 1; i <= period; ++i) {
    result += data.loanData.interestRate * restOfLoan(data, i - 1)
  }
  return result
})

export const interestBetween = memoize((data: theData, fromPeriod: number, toPeriod: number): number => {
  return interestUntil(data, toPeriod) - interestUntil(data, fromPeriod)
})

export const netWorth = memoize((data: theData, period: number): number => {
  return assetValuation(data, period) - restOfLoan(data, period)
})

const rentInPeriod = (data: theData, period: number): number => {
  const {
    rentData: {
      rentPricePerSM,
      rentIncreasePerPeriod,
      size
    }
  } = data
  return rentPricePerSM * size * Math.pow(1 + rentIncreasePerPeriod, period)
}

const rentUntilPeriod = memoize((data: theData, period): number => {
  let result = 0
  let i
  for (i = 0; i <= period; ++i) {
    result += rentInPeriod(data, i)
  }
  return result
})

export const rentBetweenPeriods = memoize((data: theData, fromPeriod: number, toPeriod: number) => {
  return rentUntilPeriod(data, toPeriod) - rentUntilPeriod(data, fromPeriod)
})

const savingsUntilPeriod = memoize((data: theData, period: number): number => {
  const {
    assetData:
      {
        equity,
        investmentReserve
      }
  } = data
  let result = 0
  let i
  for (i = 1; i <= period; ++i) {
    result += loanPaymentPerPeriod(data, i) + equity * investmentReserve - rentBetweenPeriods(data, i - 2, i - 1)
  }
  return result
})

export const savingsBetweenPeriods = memoize(
  (data: theData,
   fromPeriod: number,
   toPeriod: number): number => {
    return savingsUntilPeriod(data, toPeriod) - savingsUntilPeriod(data, fromPeriod)
  }
)

export const stockValueInPeriod = memoize(
  (data: theData,
   period: number): number => {
    const {
      stockData: {
        equity,
        stockIncreasePerPeriod
      },
      taxData: {
        capGainsTax
      }
    } = data
    let result = equity
    let i
    for (i = 1; i <= period; ++i) {
      const gainBeforeTax = result * stockIncreasePerPeriod
      result += gainBeforeTax * (1 - capGainsTax) + savingsBetweenPeriods(data, i - 1, i)
    }
    return result
  })

export const stockGainBetweenPeriods = memoize((data: theData,
                                                fromPeriod: number,
                                                toPeriod: number) => {
  return stockValueInPeriod(data, toPeriod)
    - stockValueInPeriod(data, fromPeriod)
})

const taxUntilPeriod = memoize(((data: theData,
                                 period: number) => {
  let result = 0
  let i
  const {
    stockData: {
      stockIncreasePerPeriod
    },
    taxData: {
      capGainsTax
    }
  } = data
  for (i = 1; i <= period; ++i) {
    const gainInPeriod = stockValueInPeriod(data, i) * stockIncreasePerPeriod
    result += gainInPeriod * capGainsTax
  }
  return result
}))

export const taxBetweenPeriods = memoize((data: theData,
                                          fromPeriod: number,
                                          toPeriod: number) => {
  return taxUntilPeriod(data, toPeriod) - taxUntilPeriod(data, fromPeriod)
})

export const calculateEquivalentYield = memoize(async (data: theData) => {
  const period = data.loanData.totalPeriods
  let upperLimit = 0.2
  let lowerLimit = 0
  let error = 1
  let approximationValue = 1 / 12
  let safety = 0
  const iteration = async () => {
    return new Promise((resolve, reject) => {
      approximationValue = (upperLimit + lowerLimit) / 2
      const netWorthBuyer = netWorth(data, period)
      const netWorthTenant = stockValueInPeriod({
        ...data,
        stockData: {
          ...data.stockData,
          stockIncreasePerPeriod: approximationValue
        }
      }, period)
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
