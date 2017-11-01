import * as React from 'react'
import DetailsTable from './DetailsTable'
import { Component } from 'react'

class DetailsTables extends Component {
  render() {
    return [
      <DetailsTable key="years"/>,
      <DetailsTable format="months" key="months"/>
    ]
  }
}
export default DetailsTables
