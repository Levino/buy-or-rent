import * as memoize from 'memoizee'
import memProfile from 'memoizee/profile'

(<any> window).memProfile = memProfile


export type loanDataType = {
  periods: number
  loanAmount: number
  interestRate: number,
  totalPeriods: number
}

export type AssetData = {
  equity: number
  yieldPerPeriod: number
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
    periods,
    interestRate,
    loanAmount
  } = data.loanData
  if (period >= periods) {
    return 0
  }
  return -1 * PMT(interestRate, periods, loanAmount)
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

export const interestBetween = memoize((data: theData, fromPeriod: number, toPeriod: number): number => {
  if (toPeriod < 1) {
    throw new Error('To period cannot be below 1')
  }
  if (toPeriod - fromPeriod === 1) {
    return restOfLoan(data, fromPeriod) * data.loanData.interestRate
  }
  return interestBetween(data, fromPeriod, toPeriod - 1)
    + restOfLoan(data, toPeriod - 1) * data.loanData.interestRate
})

export const netWorth = memoize((data: theData, period: number): number => {
  return assetValuation(data, period) - restOfLoan(data, period)
})



const rentInPeriod = memoize((data: theData, period) => {
  if (period === 0) {
    return data.rentData.rentPricePerSM * data.rentData.size
  }
  return rentInPeriod(data, period - 1) * (1 + data.rentData.rentIncreasePerPeriod)
})

export const rentBetweenPeriods = memoize((data: theData, fromPeriod: number, toPeriod: number) => {
  if ((toPeriod - fromPeriod) === 1) {
    return rentInPeriod(data, fromPeriod)
  }
  return rentBetweenPeriods(data, fromPeriod, toPeriod - 1) + rentInPeriod(data, toPeriod)
})

const savingsPerPeriod = memoize((data: theData, period: number): number => {
  return loanPaymentPerPeriod(data, period) - rentInPeriod(data, period)
})

export const savingsBetweenPeriods = memoize(
  (data: theData,
   fromPeriod: number,
   toPeriod: number): number => {
    if ((toPeriod - fromPeriod) === 1) {
      return savingsPerPeriod(data, fromPeriod)
    }
    return savingsBetweenPeriods(
      data,
      fromPeriod,
      toPeriod - 1) +
      savingsPerPeriod(data, toPeriod)
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
      + savingsPerPeriod(data, period)
  })

const stockGainUntilPeriod = memoize((data: theData,
                                      period: number) => {
  if (period === 0) {
    return data.stockData.equity * data.stockData.stockIncreasePerPeriod
  }
  const stockGainUntilLastPeriod = stockGainUntilPeriod(data, period - 1)
  const stockValueLastPeriod = stockValueInPeriod(data, period - 1)
  const stockGainThisPeriod = loanPaymentPerPeriod(data, period) - rentInPeriod(data, period) + stockValueLastPeriod *
    data.stockData.stockIncreasePerPeriod
  const taxThisPeriod = stockGainThisPeriod * data.taxData.capGainsTax
  return stockGainUntilLastPeriod + stockGainThisPeriod - taxThisPeriod
})

export const stockGainBetweenPeriods = memoize((data: theData,
                                                fromPeriod: number,
                                                toPeriod: number) => {
  return stockGainUntilPeriod(data, toPeriod)
  - stockGainUntilPeriod(data, fromPeriod)
})

const taxUntilPeriod = memoize(((data: theData,
                                 period: number) => {
  if (period === 0) {
    return 0
  }
  const taxForThisPeriod = stockGainBetweenPeriods(data, period, period + 1) * ( 1 - 1 / (1 - data.taxData.capGainsTax))
  return taxUntilPeriod(data, period -1) + taxForThisPeriod
}))

export const taxBetweenPeriods = memoize((data: theData,
                                          fromPeriod: number,
                                          toPeriod: number) => {
  return taxUntilPeriod(data, toPeriod) - taxUntilPeriod(data, fromPeriod)
})

export const calculateEquivalentYield = async ({
                                                 stockData,
                                                 rentData,
                                                 loanData,
                                                 taxData,
                                                 assetData
                                               }: theData) => {
  return loanData.interestRate
  /*
  const period = loanData.totalPeriods
  let upperLimit = 0.2
  let lowerLimit = 0
  let error = 1
  let approximationValue = 1 / 12
  let safety = 0
  const iteration = async () => {
    return new Promise((resolve, reject) => {
      approximationValue = (upperLimit + lowerLimit) / 2
      const netWorthBuyer = netWorth(loanData, assetData, period)
      const netWorthTenant = stockValueInPeriod(stockData, rentData, loanData, taxData, approximationValue, period)
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
  */
}
