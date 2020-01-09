import React, { Component } from 'react'
import styled from 'react-emotion'
import QrReader from 'react-qr-reader'

import { isAddress } from 'web3-utils'

import Button from '../Forms/Button'
import WarningBox from '../WarningBox'
import { Search } from '../Forms/TextInput'
import Label from '../Forms/Label'
import Select from '../Forms/Select'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'

const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`
const Filter = styled('div')`
  width: 200px;
  margin-bottom: 20px;
`

const EventFiltersContainer = styled('div')``

const QRScannerContainer = styled('div')`
  margin-top: 20px;
  width: 100%;
`

const CenteredQrReader = styled(QrReader)`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
`

class EventFilters extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    if (navigator && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then(result => {
        if (result.state === 'denied') {
          this._disableCamera()
        }
      })
    }
  }

  _disableCamera = () => {
    this.setState({ cameraUnavailable: true })
  }

  _scan = data => {
    console.log(data)
    if (!data) {
      console.log('No data')
    } else if (isAddress(data)) {
      console.log('Found Address:', data)
      this.setState({ scannerOn: false })
      this.props.handleSearch(data)
    } else {
      this.setState({
        scannerOn: false,
        scanError: "Couldn't read an address in QR code"
      })
      console.log("Can't decode data:", data)
    }
  }

  _onSearch = val => {
    this.props.handleSearch(val)
  }

  render() {
    const {
      search,
      enableQrCodeScanner,
      handleFilterChange,
      amAdmin,
      ended,
      className
    } = this.props
    const { scannerOn, scanError, cameraUnavailable } = this.state

    return (
      <EventFiltersContainer className={className}>
        {amAdmin && !ended && (
          <Filter>
            <Label>Filters</Label>
            <Select
              onChange={handleFilterChange}
              placeholder="Choose"
              options={[
                { label: 'All', value: 'all' },
                {
                  label: 'Not marked attended',
                  value: 'unmarked'
                },
                { label: 'Marked attended', value: 'marked' }
              ]}
            />
          </Filter>
        )}

        <Search
          type="text"
          Icon={SearchIcon}
          onChangeText={this._onSearch}
          value={search}
          placeholder="Search for names or addresses"
          wide
        />
        {enableQrCodeScanner ? (
          <QRCodeContainer>
            <Button
              onClick={() => this.setState({ scannerOn: !scannerOn })}
              disabled={cameraUnavailable}
            >
              {' '}
              {scannerOn ? 'Stop Scanning' : 'Scan QRCode'}
            </Button>
            {scanError ? <WarningBox>{`${scanError}`}</WarningBox> : null}
            {this.state.scannerOn ? (
              <QRScannerContainer>
                <CenteredQrReader
                  delay={400} // delay = false stops scanning
                  onError={() => {
                    this.setState({
                      scannerOn: false,
                      scanError: 'FATAL ERROR'
                    })
                    this._disableCamera()
                    setTimeout(() => this.setState({ scanError: false }), 3000)
                  }}
                  onScan={this._scan}
                  resolution={1200}
                />
              </QRScannerContainer>
            ) : null}
          </QRCodeContainer>
        ) : null}
      </EventFiltersContainer>
    )
  }
}

export default EventFilters
