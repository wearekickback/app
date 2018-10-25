import { ApolloConsumer } from 'react-apollo'
import React, { Component } from 'react'
import styled from 'react-emotion'

import Button from '../Forms/Button'
import ErrorBox from '../ErrorBox'
import { Search } from '../Forms/TextInput'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import { QRSupportedQuery, QRQuery } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'

const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`

class EventFilters extends Component {
  state = {}

  _scan = client => () => {
    this.setState({ scanError: null }, async () => {
      try {
        const { error, data = {} } = await client.query({
          query: QRQuery,
          fetchPolicy: 'no-cache', 
        })

        if (error) {
          throw error
        }

        if (data.qrCode) {
          this.props.handleSearch(data.qrCode)
        }
      } catch (scanError) {
        this.setState({ scanError })
      }
    })
  }

  _onSearch = event => {
    this.props.handleSearch(event.target.value)
  }

  render() {
    const { scanError } = this.state
    const { search, enableQrCodeScanner } = this.props

    return (
      <EventFiltersContainer>
        <Search
          type="text"
          Icon={SearchIcon}
          onChange={this._onSearch}
          value={search}
          placeholder="Search for names or addresses"
          wide
        />
        {enableQrCodeScanner ? (
          <SafeQuery query={QRSupportedQuery}>
            {({ data = {} }) => {
              return data.supported ? (
                <ApolloConsumer>
                  {client => (
                    <QRCodeContainer>
                      <Button onClick={this._scan(client)}>Scan QRCode</Button>
                      {scanError ? <ErrorBox>{`${scanError}`}</ErrorBox> : null}
                    </QRCodeContainer>
                  )}
                </ApolloConsumer>
              ) : null
            }}
          </SafeQuery>
        ) : null}

      </EventFiltersContainer>
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
