import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import Button from '../components/Forms/Button'

storiesOf('<Button>', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))
  .add('with text with wide prop', () => (
    <Button wide onClick={action('clicked')}>
      RSVP
    </Button>
  ))

storiesOf('<Button type="hollow">', module)
  .add('with text with hollow type', () => (
    <Button type="hollow" onClick={action('clicked')}>
      RSVP
    </Button>
  ))
  .add('with some emoji', () => (
    <Button type="hollow" onClick={action('clicked')}>
      😀 😎 👍 💯
    </Button>
  ))
  .add('with text with wide prop', () => (
    <Button type="hollow" wide onClick={action('clicked')}>
      RSVP
    </Button>
  ))
