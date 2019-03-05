import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import {
  assertEmailAddress,
  assertUsername,
  assertRealName,
  assertTwitterId,
  sanitizeTwitterId,
  trimOrEmptyStringProps,
  getLegalAgreement,
  getUserAcceptedLegalAgreement,
  LEGAL
} from '@wearekickback/shared'

import { removeTypename } from '../../graphql'
import InputAddress from '../Forms/InputAddress'
import DefaultTextInput from '../Forms/TextInput'
import DefaultCheckbox from '../Forms/Checkbox'
import Label from '../Forms/Label'
import { ensureInArray, ensureNotInArray } from '../../utils/arrays'
import mq from '../../mediaQuery'

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

  ${mq.medium`
    width: 80%;
  `};
`

const Checkbox = styled(DefaultCheckbox)`
  margin: 5px 0;
`

export default class ProfileForm extends Component {
  constructor(props) {
    super(props)

    const { existingProfile, latestLegal } = props
    const { legal = [], social = [], username, email, realName } =
      existingProfile || {}

    this.state = {
      canSubmit: !!existingProfile,
      values: {
        email: _.get(email, 'verified') || _.get(email, 'pending') || '',
        username,
        realName,
        twitter: _.get(
          social.find(({ type }) => type === 'twitter'),
          'value',
          ''
        ),
        terms: _.get(
          getUserAcceptedLegalAgreement(
            legal,
            latestlLegal,
            TERMS_AND_CONDITIONS
          ),
          'id'
        ),
        privacy: _.get(
          getUserAcceptedLegalAgreement(legal, latestlLegal, PRIVACY_POLICY),
          'id'
        ),
        marketing: _.get(
          getUserAcceptedLegalAgreement(legal, latestlLegal, MARKETING_INFO),
          'id'
        )
      },
      errors: {}
    }
  }

  render() {
    const { userAddress, existingProfile, renderSubmitButton } = this.props

    const { canSubmit, values, errors } = this.state

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
            data-testid="username"
            value={username}
            onChange={this.handleUsernameChange}
            errors={errors.username}
          />
          {existingProfile ? (
            <Explanation>
              If you wish to change your username please contact us at{' '}
              <strong>hello@kickback.events</strong>
            </Explanation>
          ) : (
            <Explanation>
              We hope this will be easier to remember than your account address
              (0x...)!
            </Explanation>
          )}
        </Field>
        <Field>
          <Label>Real name</Label>
          <TextInput
            placeholder="Joe Bloggs"
            value={realName}
            data-testid="realname"
            onChange={this.handleRealNameChange}
            errors={errors.realName}
          />
          <Explanation>
            We <strong>only</strong> share this with organizers of the events
            you attend, so that they can identify you on arrival.
          </Explanation>
        </Field>
        <Field>
          <Label>Email</Label>
          <TextInput
            placeholder="alice@gmail.com"
            data-testid="email"
            value={email}
            onChange={this.handleEmailChange}
            errors={errors.email}
          />
          <Explanation>
            This allows us to notify you of any changes to the event and remind
            you when it's time to withdraw your payout. We do not share this
            with anyone.
          </Explanation>
        </Field>
        <Field>
          <Label optional>Twitter</Label>
          <TextInput
            placeholder="jack"
            value={twitter}
            onChange={this.handleTwitterChange}
            errors={errors.twitter}
          />
          <Explanation>
            We use this for your profile picture, and for anyone to contact your
            over social media if they so wish.
          </Explanation>
        </Field>
        {existingProfile ? null : (
          <>
            <Checkbox
              value={TERMS_AND_CONDITIONS}
              checked={!!terms}
              testId="terms"
              onChange={this.handleTermsCheck(
                getLegalAgreement(legal, TERMS_AND_CONDITIONS)
              )}
            >
              I agree with the{' '}
              <a href={`/terms`} target="_blank" rel="noopener noreferrer">
                terms and conditions
              </a>
            </Checkbox>
            <Checkbox
              value={PRIVACY_POLICY}
              checked={!!privacy}
              testId="privacy"
              onChange={this.handlePrivacyCheck(
                getLegalAgreement(legal, PRIVACY_POLICY)
              )}
            >
              I agree with the{' '}
              <a href={`/privacy`} target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
            </Checkbox>
          </>
        )}
        <Checkbox
          value={MARKETING_INFO}
          checked={!!marketing}
          testId="marketing"
          onChange={this.handleMarketingCheck(
            getLegalAgreement(legal, MARKETING_INFO)
          )}
        >
          I am happy to receive marketing info (optional)
        </Checkbox>
        {renderSubmitButton(
          this._prepareValuesForSubmission(values),
          canSubmit
        )}
      </div>
    )
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

  _handleFieldChanged = (val, fieldName, assertionFn) => {
    this.setState(({ errors }) => {
      try {
        assertionFn(val)
        delete errors[fieldName]
      } catch (err) {
        errors[fieldName] = err.rules || 'Please correct this field'
      }

      return {
        [fieldName]: val,
        errors,
        canSubmit: !Object.keys(errors).length
      }
    })
  }

  handleUsernameChange = e => {
    this._handleFieldChanged(e.target.value, 'username', assertUsername)
  }

  handleRealNameChange = e => {
    this._handleFieldChanged(e.target.value, 'realName', assertRealName)
  }

  handleEmailChange = e => {
    this._handleFieldChanged(e.target.value, 'email', assertEmailAddress)
  }

  handleTwitterChange = e => {
    this._handleFieldChanged(
      sanitizeTwitterId(e.target.value),
      'twitter',
      assertTwitterId
    )
  }

  handleTermsCheck = ({ id }) => e => {
    const terms = e.target.checked ? id : false

    this.setState(({ canSubmit }) => ({
      terms,
      canSubmit: canSubmit && terms
    }))
  }

  handlePrivacyCheck = ({ id }) => e => {
    const privacy = e.target.checked ? id : false

    this.setState(({ canSubmit }) => ({
      privacy,
      canSubmit: canSubmit && privacy
    }))
  }

  handleMarketingCheck = ({ id }) => e => ({
    marketing: e.target.checked ? id : false
  })
}
