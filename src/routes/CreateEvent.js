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

const AddrDisplay = styled('span')`
  background-color: #6e76ff;
  color: #fff;
  border-radius: 2px;
  padding: 4px;
  font-size: 10px;
  margin-right: 10px;
`

const UnlockUserDetails = styled('div')`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  transition: transform 300ms ease-in-out;
`

export default function Create() {
  const [password, setPassword] = useState('')
  const [locked, setLocked] = useState('pending')
  const [membership, setMembership] = useState('')
  const [membershipAddr, setMembershipAddr] = useState('')
  let history = useHistory()

  const _onCreated = ({ id }, deposit, limitOfParticipants, coolingPeriod) => {
    history.push(
      `/deploy?id=${id}&deposit=${deposit}&limitOfParticipants=${limitOfParticipants}&coolingPeriod=${coolingPeriod}`
    )
  }

  const updateUnlockUser = () => {
    // sets membership lock and lock name to state
    let unlock = window.unlockProtocol.blockchainData()
    let locks = Object.keys(unlock.locks).map(i => unlock.locks[i])
    let bronze = locks.find(o => o.name.includes('Kickback Bronze'))
    let gold = locks.find(o => o.name.includes('Kickback Gold'))
    if (gold) {
      setMembership(gold.name)
      setMembershipAddr(gold.address)
    } else {
      setMembership(bronze.name)
      setMembershipAddr(bronze.address)
    }
  }

  const unlockHandler = async e => {
    /*
      Status can either be 'unlocked' or 'locked'...
      If state is 'unlocked': implement code here which will be triggered when 
      the current visitor has a valid lock key  
      If state is 'locked': implement code here which will be
      triggered when the current visitor does not have a valid lock key
    */

    setLocked(e.detail)

    // run this loop only if unlocked
    if (e.detail === 'unlocked') {
      // blockchainData() will load empty first, check if loaded before updating state every, checks every 100 ms
      let checkExist = setInterval(function() {
        if (window.unlockProtocol.blockchainData()) {
          updateUnlockUser()
          clearInterval(checkExist)
        }
      }, 100)
    }
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
      ENV !== 'local' &&
        window.removeEventListener('unlockProtocol', unlockHandler)
    }
  }, [])

  return (
    <CreateContainer>
      {
        {
          unlocked: (
            <div>
              {membershipAddr !== '' && (
                <UnlockUserDetails>
                  <AddrDisplay>{membership}</AddrDisplay>
                  <AddrDisplay>{membershipAddr}</AddrDisplay>
                </UnlockUserDetails>
              )}
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
            </div>
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
