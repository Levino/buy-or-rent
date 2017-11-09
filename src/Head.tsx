import * as React from 'react'
import Head from 'next/head'

const BuyOrRentHead = () =>
  <div>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
      />
    </Head>
    <style jsx={true} global={true}>{`
          body {
            margin-top: 1em;
            margin-bottom: 1em;
          }
        `}</style>
  </div>

export default BuyOrRentHead
