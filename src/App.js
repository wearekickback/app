import React, { Component } from 'react'
import logo from './logo.svg'
import { Query } from 'react-apollo'
import './App.css'
import gql from 'graphql-tag'

const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Query query={EthersQuery}>
          {({ data }) => {
            console.log(data)
            return <div>hello</div>
          }}
        </Query>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
