import React, { useState, useEffect } from 'react'
import styled from 'react-emotion'
import { useHistory } from 'react-router-dom'
import DefaultTextInput from '../components/Forms/TextInput'
import Label from '../components/Forms/Label'
import DefaultButton from '../components/Forms/Button'
import Loader from '../components/Loader'
import { ENV } from '../config'
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
  margin: 60px auto 0px auto;
`

const UnlockCredit = styled('div')`
  margin: 40px auto 140px auto;
  font-size: 14px;
`

const UnlockedLogo = styled('a')`
  color: #ff6771;
  font-weight: 800;
`

export default function Create() {
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
    /*
      Status can either be 'unlocked' or 'locked'...
      If state is 'unlocked': implement code here which will be triggered when 
      the current visitor has a valid lock key  
      If state is 'locked': implement code here which will be
      triggered when the current visitor does not have a valid lock key
    */
  }

  const checkout = () => {
    window.ethereum.enable()
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()
  }

  useEffect(() => {
    if (ENV !== 'local') {
      window.addEventListener('unlockProtocol', unlockHandler)
    } else {
      setLocked('unlocked')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (ENV !== 'local')
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
              <h1>Deploy your Kickback contract with us</h1>
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
          pending: <Loader />,
          default: <div>Please enable Javascript</div>
        }[locked || locked['default']]
      }
    </CreateContainer>
  )
}
