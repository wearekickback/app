import React, { useState, useEffect } from 'react'
import styled from 'react-emotion'
import { useHistory } from 'react-router-dom'
import DefaultTextInput from '../components/Forms/TextInput'
import Label from '../components/Forms/Label'
import DefaultButton from '../components/Forms/Button'

import PartyForm from '../components/SingleEvent/Admin/PartyForm'
import { CREATE_PENDING_PARTY } from '../graphql/mutations'

const CreateContainer = styled('div')`
  display: flex;
  max-width: 800px;
  flex-direction: column;
`

const LockedContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 20px;
`

const Button = styled(DefaultButton)`
  width: 300px;
  margin: 60px auto 0px auto;
`

const UnlockCredit = styled('div')`
  margin: 30px auto 80px auto;
`

const UnlockedLogo = styled('a')`
  color: #ff6771;
  font-weight: 700;
`

function Create() {
  const [password, setPassword] = useState('')
  const [locked, setLocked] = useState('pending')
  let history = useHistory()

  const _onCreated = ({ id }, deposit, limitOfParticipants, coolingPeriod) => {
    history.push(
      `/deploy?id=${id}&deposit=${deposit}&limitOfParticipants=${limitOfParticipants}&coolingPeriod=${coolingPeriod}`
    )
  }

  const unlockHandler = e => {
    setLocked(e.detail)
    console.log(e.detail)
    /*
      Status can either be 'unlocked' or 'locked'...
      If state is 'unlocked': implement code here which will be triggered when 
      the current visitor has a valid lock key  
      If state is 'locked': implement code here which will be
      triggered when the current visitor does not have a valid lock key
    */
  }

  const checkout = () => {
    console.log(window.unlockProtocol)
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()
  }

  useEffect(() => {
    window.addEventListener('unlockProtocol', unlockHandler)
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener('unlockProtocol', unlockHandler)
    }
  }, [])

  return (
    <CreateContainer>
      {
        {
          unlocked: (
            <PartyForm
              onCompleted={_onCreated}
              mutation={CREATE_PENDING_PARTY}
              variables={{ password }}
              type="create"
            >
              <Label>SECRET PASSWORD:</Label>
              <TextInput
                value={password}
                onChangeText={val => setPassword(val)}
                type="password"
              />
            </PartyForm>
          ),
          locked: (
            <LockedContainer>
              <h2>Deploy your Kickback contract with us</h2>
              <p>
                Kickback offers paid benefits for event organizers publishing
                their own kickback contract. Membership comes in two tiers.
              </p>
              <Button
                data-testid="unlock-button"
                analyticsId="Unlock Membership"
                onClick={checkout}
              >
                Unlock Membership
              </Button>
              <UnlockCredit>
                Powered by{' '}
                <UnlockedLogo href="https://unlock-protocol.com/">
                  Unlock
                </UnlockedLogo>
              </UnlockCredit>
            </LockedContainer>
          ),
          pending: <div>Loading Unlock</div>,
          default: <div>Please enable Javascript</div>
        }[locked || locked['default']]
      }
    </CreateContainer>
  )
}

export default Create
