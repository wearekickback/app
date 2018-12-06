import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'

import ChainMutation, { ChainMutationButton } from '../components/ChainMutation'
import { CreateParty } from '../graphql/mutations'
import { GlobalConsumer } from '../GlobalState'
import { extractNewPartyAddressFromTx } from '../api/utils'
import queryString from 'query-string'

const SeedDiv = styled('div')`
  margin-bottom: 2em;
  background-color: #efefef;
  padding: 1em;
`

class DeployPendingEvent extends Component {
  render() {
    const {
      id,
      deposit,
      limitOfParticipants,
      coolingPeriod
    } = queryString.parse(this.props.location.search)

    return (
      <div className="App">
        <GlobalConsumer>
          {({ networkState: { isLocalNetwork, networkName, resolved } }) =>
            !resolved ? (
              <p>Loading...</p>
            ) : (
              <>
                <h1>Deploy pending party</h1>
                <SeedDiv>
                  <p>
                    If you wish to deploy this party with our seeding script,
                    use:
                  </p>
                  <pre>
                    yarn seed:party -i {id}{' '}
                    {isLocalNetwork ? '' : `--${networkName.toLowerCase()}`}
                  </pre>
                </SeedDiv>
                <div>
                  <div>id/name: {id}</div>
                  <div>deposit: {deposit}</div>
                  <div>limitOfParticipants: {limitOfParticipants}</div>
                  <div>coolingPeriod: {coolingPeriod}</div>
                  <ChainMutation
                    mutation={CreateParty}
                    resultKey="create"
                    variables={{
                      id,
                      deposit,
                      limitOfParticipants,
                      coolingPeriod
                    }}
                  >
                    {(createParty, result) => {
                      const address = result.data
                        ? extractNewPartyAddressFromTx(result.data)
                        : null

                      return (
                        <div>
                          <ChainMutationButton
                            analyticsId="Deploy Event Contract"
                            result={result}
                            onClick={createParty}
                            preContent="Deploy"
                            postContent="Deployed!"
                          />
                          {address ? (
                            <p>
                              Event at {address}!{' '}
                              <Link to={`/event/${address}`}>
                                View event page
                              </Link>
                            </p>
                          ) : null}
                        </div>
                      )
                    }}
                  </ChainMutation>
                </div>
              </>
            )
          }
        </GlobalConsumer>
      </div>
    )
  }
}

export default DeployPendingEvent
