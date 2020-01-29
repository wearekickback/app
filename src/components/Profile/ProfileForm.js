import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'

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
import { CHECK_IF_USERNAME_IS_AVAILABLE_QUERY } from '../../graphql/queries'
import InputAddress from '../Forms/InputAddress'
import DefaultTextInput from '../Forms/TextInput'
import DefaultCheckbox from '../Forms/Checkbox'
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

const Checkbox = styled(DefaultCheckbox)`
  margin: 5px 0;
`

export default withApollo(
  class ProfileForm extends Component {
    constructor(props) {
      super(props)

      const { existingProfile, latestLegal } = props

      const legal = _.get(existingProfile, 'legal') || []
      const social = _.get(existingProfile, 'social') || []
      const username = _.get(existingProfile, 'username') || ''
      const email =
        _.get(existingProfile, 'email.verified') ||
        _.get(existingProfile, 'email.pending') ||
        ''
      const realName = _.get(existingProfile, 'realName') || ''
      const twitter =
        _.get(
          social.find(({ type }) => type === 'twitter'),
          'value'
        ) || ''
      const terms = _.get(
        getUserAcceptedLegalAgreement(legal, latestLegal, TERMS_AND_CONDITIONS),
        'id'
      )
      const privacy = _.get(
        getUserAcceptedLegalAgreement(legal, latestLegal, PRIVACY_POLICY),
        'id'
      )
      const marketing = _.get(
        getUserAcceptedLegalAgreement(legal, latestLegal, MARKETING_INFO),
        'id'
      )

      const alreadyAcceptedTerms = !!terms
      const alreadyAcceptedPrivacy = !!privacy

      this.state = {
        values: {
          email,
          username,
          realName,
          social,
          legal,
          twitter,
          terms,
          privacy,
          marketing,
          alreadyAcceptedTerms,
          alreadyAcceptedPrivacy
        },
        errors: {
          ...(terms ? null : { terms: [] }),
          ...(privacy ? null : { privacy: [] })
        }
      }
    }

    render() {
      const {
        userAddress,
        renderSubmitButton,
        latestLegal,
        client
      } = this.props

      const { values, errors } = this.state

      const {
        username,
        realName,
        email,
        twitter,
        terms,
        privacy,
        marketing,
        alreadyAcceptedTerms,
        alreadyAcceptedPrivacy
      } = values

      const canSubmit = !Object.keys(errors).length

      return (
        <div>
          <Label>Ethereum address</Label>
          <InputAddress address={userAddress} />
          <Field>
            <Label>Username</Label>
            <TextInput
              placeholder="username"
              data-testid="username"
              value={username}
              onChangeText={this.handleUsernameChange(client)}
              errors={errors.username}
            />
            <Explanation>
              We hope this will be easier to remember than your account address
              (0x...)!
            </Explanation>
          </Field>
          <Field>
            <Label>Real name</Label>
            <TextInput
              placeholder="Joe Bloggs"
              value={realName}
              data-testid="realname"
              onChangeText={this.handleRealNameChange}
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
              onChangeText={this.handleEmailChange}
              errors={errors.email}
            />
            <Explanation>
              This allows us to notify you of any changes to the event and
              remind you when it's time to withdraw your payout. We do not share
              this with anyone.
            </Explanation>
          </Field>
          <Field>
            <Label optional>Twitter</Label>
            <TextInput
              prefix="@"
              placeholder="jack"
              value={twitter}
              onChangeText={this.handleTwitterChange}
              errors={errors.twitter}
            />
            <Explanation>
              We use this for your profile picture, and for anyone to contact
              you over social media if they so wish.
            </Explanation>
          </Field>
          {terms && alreadyAcceptedTerms ? null : (
            <Checkbox
              value={TERMS_AND_CONDITIONS}
              checked={!!terms}
              testId="terms"
              onChange={this.handleTermsCheck(
                getLegalAgreement(latestLegal, TERMS_AND_CONDITIONS)
              )}
            >
              I agree with the{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                terms and conditions
              </Link>
            </Checkbox>
          )}
          {privacy && alreadyAcceptedPrivacy ? null : (
            <Checkbox
              value={PRIVACY_POLICY}
              checked={!!privacy}
              testId="privacy"
              onChange={this.handlePrivacyCheck(
                getLegalAgreement(latestLegal, PRIVACY_POLICY)
              )}
            >
              I agree with the{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                privacy policy
              </Link>
            </Checkbox>
          )}
          <Checkbox
            value={MARKETING_INFO}
            checked={!!marketing}
            testId="marketing"
            onChange={this.handleMarketingCheck(
              getLegalAgreement(latestLegal, MARKETING_INFO)
            )}
          >
            I am happy to receive marketing info (optional)
          </Checkbox>
          {renderSubmitButton(canSubmit, this._prepareValuesForSubmission)}
        </div>
      )
    }

    _prepareValuesForSubmission = () => {
      const { values } = this.state

      const {
        email,
        username,
        realName,
        twitter,
        terms,
        privacy,
        marketing
      } = values

      let { legal, social } = values

      social = social.map(v => removeTypename(v))
      social = ensureInArray(
        social,
        'type',
        { type: 'twitter', value: twitter },
        true
      )

      legal = legal.map(v => removeTypename(v))
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

    _handleTextFieldChanged = (
      val,
      fieldName,
      assertionFn,
      { required } = {},
      cb
    ) => {
      this.setState(({ values, errors }) => {
        try {
          if (val || required) {
            assertionFn(val)
          }
          delete errors[fieldName]
        } catch (err) {
          errors[fieldName] = err.rules || ['Please correct this field']
        }

        return {
          values: {
            ...values,
            [fieldName]: val
          },
          errors
        }
      }, cb)
    }

    _handleLegalFieldChanged = (id, checked, fieldName, { required } = {}) => {
      this.setState(({ values, errors, canSubmit }) => {
        const val = checked ? id : false

        if (val || !required) {
          delete errors[fieldName]
        } else {
          errors[fieldName] = ['Please tick this box']
        }

        return {
          values: {
            ...values,
            [fieldName]: val
          },
          errors
        }
      })
    }

    handleUsernameChange = apolloClient => val => {
      this._handleTextFieldChanged(
        val,
        'username',
        assertUsername,
        {
          required: true
        },
        () => this.checkIfUsernameIsTaken({ apolloClient })
      )
    }

    checkIfUsernameIsTaken = _.debounce(async ({ apolloClient }) => {
      const {
        errors,
        values: { username }
      } = this.state
      const { existingProfile } = this.props

      if (errors.username || _.get(existingProfile, 'username') === username) {
        return
      }

      try {
        const {
          data: { available }
        } = await apolloClient.query({
          query: CHECK_IF_USERNAME_IS_AVAILABLE_QUERY,
          variables: {
            username
          },
          fetchPolicy: 'network-only'
        })

        if (!available) {
          this.setState({
            errors: {
              ...errors,
              username: ['This username has already been taken']
            }
          })
        }
      } catch (err) {
        console.error(err)
      }
    }, 250 /* give time for typing to end */)

    handleRealNameChange = val => {
      this._handleTextFieldChanged(val, 'realName', assertRealName, {
        required: true
      })
    }

    handleEmailChange = val => {
      this._handleTextFieldChanged(val, 'email', assertEmailAddress, {
        required: true
      })
    }

    handleTwitterChange = val => {
      this._handleTextFieldChanged(
        sanitizeTwitterId(val),
        'twitter',
        assertTwitterId
      )
    }

    handleTermsCheck = ({ id }) => checked => {
      this._handleLegalFieldChanged(id, checked, 'terms', { required: true })
    }

    handlePrivacyCheck = ({ id }) => checked => {
      this._handleLegalFieldChanged(id, checked, 'privacy', { required: true })
    }

    handleMarketingCheck = ({ id }) => checked => {
      this._handleLegalFieldChanged(id, checked, 'marketing')
    }
  }
)
