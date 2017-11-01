import * as React from 'react'
import {Table} from 'reactstrap'
import {getLoanData, getPropertyAssetData} from './selectors'
import {connect} from 'react-redux'
import {MoneyString} from './helperComponents'
import {assetValuation, interestBetween, netWorth, PMT, restOfLoan} from './helpers'
import {curry, times} from 'lodash'

interface LoanPaymentsProps {
  periods: number
  format?: 'years' | 'months'
  loanPaymentPerPeriod: number

  loanAmount(period: number, other?: number): number

  interestBetweenPeriods(periodFrom: number, periodTo: number): number

  assetValuationForPeriod(period: number, ...args: {}[]): number

  netWorthPerPeriod(period: number, ...args: {}[]): number
}

const periodToYear = period => Math.round((period + 1 ) / 12 + 2018)

const LoanPaymentsComponent = ({
                                 loanAmount,
                                 interestBetweenPeriods,
                                 loanPaymentPerPeriod,
                                 periods,
                                 format = 'years',
                                 assetValuationForPeriod,
                                 netWorthPerPeriod
                               }: LoanPaymentsProps) => {
  // If format is years then we only want to render every 12th period
  let periodsArray = times(periods)
  let periodGap = 1
  let loanPayment = loanPaymentPerPeriod
  if (format === 'years') {
    periodsArray = periodsArray.filter(period => (period % 12 === 0))
    loanPayment *= 12
    periodGap = 12
  }
  return <Table size="sm" bordered={true} responsive={true}>
    <thead>
    <tr>
      <th/>
      <th style={{textAlign: 'center'}} colSpan={6}>Käufer</th>
      <th style={{textAlign: 'center'}} colSpan={6}>Mieter</th>
    </tr>
    <tr>
      <th>Jahr</th>
      {/* Käufer */}
      <th style={{textAlign: 'right'}}>Schulden Jahresbeginn</th>
      <th style={{textAlign: 'right'}}>Tilgung</th>
      <th style={{textAlign: 'right'}}>Zinsen</th>
      <th style={{textAlign: 'right'}}>Schulden Jahresende</th>
      <th style={{textAlign: 'right'}}>Wert Immobilie Jahresende</th>
      <th style={{textAlign: 'right'}}>Networth</th>
      {/* Mieter */}
      <th style={{textAlign: 'right'}}>Jahresmiete</th>
      <th style={{textAlign: 'right'}}>Monatsmiete</th>
      <th style={{textAlign: 'right'}}>Sparrate</th>
      <th style={{textAlign: 'right'}}>Rendite</th>
      <th style={{textAlign: 'right'}}>Steuern</th>
      <th style={{textAlign: 'right'}}>Aktienvermögen Jahresende</th>
      <th style={{textAlign: 'right'}}>Networth</th>
    </tr>
    </thead>
    <tbody>
    {
      periodsArray.map((period, index) => (
        <tr key={period}>
          <td>{(format === 'years') ? periodToYear(period) : period + 1}</td>
          {/* Käufer */}
          <td style={{textAlign: 'right'}}><MoneyString value={loanAmount(period)}/></td>
          <td style={{textAlign: 'right'}}><MoneyString value={loanPayment}/></td>
          <td style={{textAlign: 'right'}}><MoneyString
            value={interestBetweenPeriods(period, period + periodGap)}/></td>
          <td style={{textAlign: 'right'}}><MoneyString value={loanAmount(period + periodGap)}/></td>
          <td style={{textAlign: 'right'}}><MoneyString value={assetValuationForPeriod(period + periodGap)}/>
          </td>
          <td style={{textAlign: 'right'}}><MoneyString value={netWorthPerPeriod(period + periodGap)}/>
          </td>
        </tr>
      ))
    }
    </tbody>
  </Table>
}

const mapStateToProps = (state: any) => {
  const loanData = getLoanData(state)
  const equityData = getPropertyAssetData(state)

  const curriedRestOfLoan = curry(restOfLoan, 2)
  const loanAmount = curriedRestOfLoan(loanData)

  const curriedAssetValuation = curry(assetValuation)
  const assetValuationForPeriod = curriedAssetValuation(equityData)

  const curriedInterestBetween = curry(interestBetween, 3)
  const interestBetweenPeriods = curriedInterestBetween(loanData)

  const loanPaymentPerPeriod = PMT(loanData.interestRate, loanData.periods, loanAmount(0))

  const netWorthPerPeriod = curry(netWorth, 3)(loanData, equityData)

  return {
    loanAmount,
    assetValuationForPeriod,
    periods: loanData.periods,
    interestBetweenPeriods,
    loanPaymentPerPeriod,
    netWorthPerPeriod
  }
}

export default connect(mapStateToProps)(LoanPaymentsComponent)
