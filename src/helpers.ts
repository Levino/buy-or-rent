import * as memoize from 'memoizee'

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

const loanPaymentUntil = (data: theData, period: number) => {
  const {
    assetData: {
      equity,
      investmentReserve
    }
  } = data
  if (period === 0) {
    return 0
  }
  return loanPaymentUntil(data, period - 1) + loanPaymentPerPeriod(data, period) + equity * investmentReserve
}

export const buyerPaymentsBetween = (data: theData, fromPeriod: number, toPeriod: number) => {
  return loanPaymentUntil(data, toPeriod) - loanPaymentUntil(data, fromPeriod)
}

const amountAtEndOfPeriod = memoize((amountAtBeginning: number, interestRate: number, paymentPerPeriod: number): number => amountAtBeginning * (1 + interestRate) + paymentPerPeriod)

const uncachedRestOfLoan = (data: theData,
                            period: number): number => {
  const {
    loanAmount,
    interestRate,
    periods
  } = data.loanData
  if (period >= periods) {
    return 0
  }
  const paymentPerPeriod = PMT(interestRate, periods, loanAmount)
  if (period === 0) {
    return loanAmount
  }
  return amountAtEndOfPeriod(restOfLoan(data, period - 1), interestRate, paymentPerPeriod)
}

export const restOfLoan = memoize(uncachedRestOfLoan)

export const assetValuation = memoize((data: theData, period: number): number => {
  const {
    equity,
    yieldPerPeriod
  } = data.assetData
  if (period === 0) {
    return equity
  }
  return assetValuation(data, period - 1) * (1 + yieldPerPeriod)
})

const interestUntil = memoize((data: theData, period: number) => {
  if (period === 0) {
    return 0
  }
  const interestUntilLastPeriod = interestUntil(data, period - 1)
  const interestThisPeriod = restOfLoan(data, period - 1) * data.loanData.interestRate
  return interestThisPeriod + interestUntilLastPeriod
})

export const interestBetween = memoize((data: theData, fromPeriod: number, toPeriod: number): number => {
  return interestUntil(data, toPeriod) - interestUntil(data, fromPeriod)
})

export const netWorth = memoize((data: theData, period: number): number => {
  return assetValuation(data, period) - restOfLoan(data, period)
})

const rentUntilPeriod = memoize((data: theData, period) => {
  const rentPriceAtBeginning = data.rentData.rentPricePerSM * data.rentData.size
  if (period === -1) {
    return 0
  }
  return rentUntilPeriod(data, period - 1) + (rentPriceAtBeginning * Math.pow(1 + data.rentData.rentIncreasePerPeriod, period))
})

export const rentBetweenPeriods = memoize((data: theData, fromPeriod: number, toPeriod: number) => {
  return rentUntilPeriod(data, toPeriod) - rentUntilPeriod(data, fromPeriod)
})

const savingsUntilPeriod = memoize((data: theData, period: number): number => {
  if (period === 0) {
    return 0
  }
  const savingsUntilLastPeriod = savingsUntilPeriod(data, period - 1)
  const savingsThisPeriod = buyerPaymentsBetween(data, period -1, period) - rentBetweenPeriods(data, period - 2, period - 1)
  return savingsUntilLastPeriod + savingsThisPeriod
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
    if (period < 0) {
      throw new Error('period cannot be negative!')
    }
    if (period === 0) {
      return data.stockData.equity
    }
    return stockValueInPeriod(data, period - 1)
      * (1 + (data.stockData.stockIncreasePerPeriod * (1 - data.taxData.capGainsTax)))
      + savingsBetweenPeriods(data, period - 1, period)
  })

export const stockGainBetweenPeriods = memoize((data: theData,
                                                fromPeriod: number,
                                                toPeriod: number) => {
  return stockValueInPeriod(data, toPeriod)
    - stockValueInPeriod(data, fromPeriod)
})

const taxUntilPeriod = memoize(((data: theData,
                                 period: number) => {
  if (period === 0) {
    return 0
  }
  const taxForThisPeriod = stockGainBetweenPeriods(data, period, period + 1) * ( 1 / (1 - data.taxData.capGainsTax) - 1)
  return taxUntilPeriod(data, period - 1) + taxForThisPeriod
}))

export const taxBetweenPeriods = memoize((data: theData,
                                          fromPeriod: number,
                                          toPeriod: number) => {
  return taxUntilPeriod(data, toPeriod) - taxUntilPeriod(data, fromPeriod)
})

export const calculateEquivalentYield = async (data: theData) => {
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
}
