import React, { useContext } from 'react'
import styled from 'react-emotion'
import { calculateFinalizeMaps } from '@wearekickback/shared'

import GlobalContext from '../../../GlobalState'
import { PARTY_QUERY } from '../../../graphql/queries'
import { FINALIZE } from '../../../graphql/mutations'

import ChainMutation, { ChainMutationButton } from '../../ChainMutation'
import Button from '../../Forms/Button'
import { CONFIRM_TRANSACTION } from '../../../modals'
import ConfirmModal from '../../ConfirmModal'

const FinalizeContainer = styled('div')``

function Finalize({ party }) {
  const { showModal, closeModal, apolloClient } = useContext(GlobalContext)
  const { ended } = party
  return (
    <FinalizeContainer>
      {!ended ? (
        <>
          <Button
            onClick={async () => {
              const result = await apolloClient.query({
                query: PARTY_QUERY,
                variables: { address: party.address },
                fetchPolicy: 'network-only'
              })

              const { address, participants } = result.data.party

              showModal({
                name: CONFIRM_TRANSACTION,
                render: () => (
                  <ConfirmModal
                    message="Finalizing enables payouts for all that have been marked attended. This can only be done once is irreversible, are you sure you want to finalize?"
                    closeModal={() => closeModal({ name: CONFIRM_TRANSACTION })}
                    mutationComponent={
                      <ChainMutation
                        mutation={FINALIZE}
                        resultKey="finalize"
                        variables={{
                          address,
                          maps: calculateFinalizeMaps(participants)
                        }}
                        refetchQueries={[
                          {
                            query: PARTY_QUERY,
                            variables: {
                              address
                            }
                          }
                        ]}
                      >
                        {(finalize, result) => (
                          <ChainMutationButton
                            analyticsId="Finalize Event"
                            result={result}
                            onClick={finalize}
                            preContent="Finalize and enable payouts"
                            postContent="Finalized!"
                          />
                        )}
                      </ChainMutation>
                    }
                  >
                    rendering
                  </ConfirmModal>
                )
              })
            }}
          >
            Finalize
          </Button>
        </>
      ) : null}
    </FinalizeContainer>
  )
}

export default Finalize
