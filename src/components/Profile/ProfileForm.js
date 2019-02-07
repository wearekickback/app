import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import {
  isEmailAddress,
  isUsername,
  isRealName,
  isTwitterId,
  sanitizeTwitterId,
  trimOrEmptyStringProps,
  getLegalAgreement,
  getUserAcceptedLegalAgreement,
  LEGAL
} from '@wearekickback/shared'

import { removeTypename } from '../../graphql'
import { LegalAgreementsQuery } from '../../graphql/queries'
import InputAddress from '../Forms/InputAddress'
import SafeQuery from '../SafeQuery'
import DefaultTextInput from '../Forms/TextInput'
import Label from '../Forms/Label'
import { ensureInArray, ensureNotInArray } from '../../utils/arrays'

const { TERMS_AND_CONDITIONS, PRIVACY_POLICY, MARKETING_INFO } = LEGAL

const Field = styled('div')`
  margin: 30px 0;
`

const Explanation = styled('div')`
  color: #999;
  font-size: 80%;
  margin-top: 7px;
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 0;
  width: 100%;
`

export default class ProfileForm extends Component {
  state = {}

  render() {
    return this.renderForm()
  }

  renderForm() {
    const { userAddress, existingProfile, renderSubmitButton } = this.props

    return (
      <SafeQuery query={LegalAgreementsQuery}>
        {({ data: { legal } }) => {
          const values = this._currentValues(existingProfile, legal)

          const {
            username,
            realName,
            email,
            twitter,
            terms,
            privacy,
            marketing
          } = values

          return (
            <div>
              <Label>Ethereum address</Label>
              <InputAddress address={userAddress} />
              <Field>
                <Label>Username</Label>
                <TextInput
                  disabled={!!existingProfile}
                  placeholder="username"
                  value={username}
                  onChange={this.handleUsernameChange}
                />
                {existingProfile ? (
                  <Explanation>
                    If you wish to change your username please contact us at{' '}
                    <strong>hello@kickback.events</strong>
                  </Explanation>
                ) : (
                  <Explanation>
                    We hope this will be easier to remember than your account
                    address (0x...)!
                  </Explanation>
                )}
              </Field>
              <Field>
                <Label>Real name</Label>
                <TextInput
                  placeholder="Joe Bloggs"
                  value={realName}
                  onChange={this.handleRealNameChange}
                />
                <Explanation>
                  We <strong>only</strong> share this with organizers of the
                  events you attend, so that they can identify you on arrival.
                </Explanation>
              </Field>
              <Field>
                <Label>Email</Label>
                <TextInput
                  placeholder="alice@gmail.com"
                  value={email}
                  onChange={this.handleEmailChange}
                />
                <Explanation>
                  This allows us to notify you of any changes to the event and
                  remind you when it's time to withdraw your payout. We do not
                  share this with anyone.
                </Explanation>
              </Field>
              <Field>
                <Label optional>Twitter</Label>
                <TextInput
                  placeholder="jack"
                  value={twitter}
                  onChange={this.handleTwitterChange}
                />
                <Explanation>
                  We use this for your profile picture, and for anyone to
                  contact your over social media if they so wish.
                </Explanation>
              </Field>
              {existingProfile ? null : (
                <p>
                  <input
                    type="checkbox"
                    value={TERMS_AND_CONDITIONS}
                    checked={!!terms}
                    onChange={this.handleTermsCheck(
                      getLegalAgreement(legal, TERMS_AND_CONDITIONS)
                    )}
                  />{' '}
                  I agree with the{' '}
                  <a href={`/terms`} target="_blank" rel="noopener noreferrer">
                    terms and conditions
                  </a>
                </p>
              )}
              {existingProfile ? null : (
                <p>
                  <input
                    type="checkbox"
                    value={PRIVACY_POLICY}
                    checked={!!privacy}
                    onChange={this.handlePrivacyCheck(
                      getLegalAgreement(legal, PRIVACY_POLICY)
                    )}
                  />{' '}
                  I agree with the{' '}
                  <a
                    href={`/privacy`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                  </a>
                </p>
              )}
              <p>
                <input
                  type="checkbox"
                  value={MARKETING_INFO}
                  checked={!!marketing}
                  onChange={this.handleMarketingCheck(
                    getLegalAgreement(legal, MARKETING_INFO)
                  )}
                />{' '}
                I am happy to receive marketing info (optional)
              </p>
              {renderSubmitButton(
                this._prepareValuesForSubmission(values),
                this._valuesAreValid(values)
              )}
            </div>
          )
        }}
      </SafeQuery>
    )
  }

  _currentValues(existingProfile = {}, legal) {
    const {
      email,
      twitter,
      username,
      realName,
      terms,
      privacy,
      marketing
    } = this.state

    return {
      username: existingProfile.username || username,
      realName: realName !== undefined ? realName : existingProfile.realName,
      email:
        email !== undefined
          ? email
          : _.get(existingProfile, 'email.verified', '') ||
            _.get(existingProfile, 'email.pending', ''),
      twitter:
        twitter !== undefined
          ? twitter
          : _.get(
              (existingProfile.social || []).find(
                ({ type }) => type === 'twitter'
              ),
              'value',
              ''
            ),
      terms:
        terms !== undefined
          ? terms
          : _.get(
              getUserAcceptedLegalAgreement(
                existingProfile.legal,
                legal,
                TERMS_AND_CONDITIONS
              ),
              'id'
            ),
      privacy:
        privacy !== undefined
          ? privacy
          : _.get(
              getUserAcceptedLegalAgreement(
                existingProfile.legal,
                legal,
                PRIVACY_POLICY
              ),
              'id'
            ),
      marketing:
        marketing !== undefined
          ? marketing
          : _.get(
              getUserAcceptedLegalAgreement(
                existingProfile.legal,
                legal,
                MARKETING_INFO
              ),
              'id'
            )
    }
  }

  _prepareValuesForSubmission(values) {
    const { existingProfile = {} } = this.props

    const {
      email,
      twitter,
      username,
      realName,
      terms,
      privacy,
      marketing
    } = values

    let social = (existingProfile.social || []).map(v => removeTypename(v))
    social = ensureInArray(
      social,
      'type',
      { type: 'twitter', value: sanitizeTwitterId(twitter) },
      true
    )

    let legal = (existingProfile.legal || []).map(v => removeTypename(v))
    if (terms) {
      legal = ensureInArray(
        legal,
        'id',
        { id: terms, type: TERMS_AND_CONDITIONS, accepted: `${Date.now()}` },
        false
      )
    }
    if (privacy) {
      legal = ensureInArray(
        legal,
        'id',
        { id: privacy, type: PRIVACY_POLICY, accepted: `${Date.now()}` },
        false
      )
    }
    if (marketing) {
      legal = ensureInArray(
        legal,
        'id',
        { id: marketing, type: MARKETING_INFO, accepted: `${Date.now()}` },
        false
      )
    } else {
      legal = ensureNotInArray(legal, 'type', { type: MARKETING_INFO })
    }

    return {
      ...trimOrEmptyStringProps({ email, username, realName }),
      social,
      legal
    }
  }

  _valuesAreValid(values) {
    const { email, twitter, username, realName, terms, privacy } = values

    if (!isUsername(username)) {
      return false
    }

    if (!isRealName(realName)) {
      return false
    }

    if (!isEmailAddress(email)) {
      return false
    }

    if (twitter && !isTwitterId(sanitizeTwitterId(twitter))) {
      return false
    }

    if (!terms) {
      return false
    }

    if (!privacy) {
      return false
    }

    return true
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    })
  }

  handleRealNameChange = e => {
    this.setState({
      realName: e.target.value
    })
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    })
  }

  handleTwitterChange = e => {
    this.setState({
      twitter: e.target.value
    })
  }

  handleTermsCheck = ({ id }) => e => {
    this.setState({
      terms: e.target.checked ? id : false
    })
  }

  handlePrivacyCheck = ({ id }) => e => {
    this.setState({
      privacy: e.target.checked ? id : false
    })
  }

  handleMarketingCheck = ({ id }) => e => {
    this.setState({
      marketing: e.target.checked ? id : false
    })
  }
}
