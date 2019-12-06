# Kickback Dapp

- Dev version: https://kovan.kickback.events
- Live version: https://kickback.events

## Dev guide

Currently only frontend is open sourced.
If you are working on the integration and need to connect to our backend, please contact Kickback team.

## Contribution Style guide

At Kickback we adhere to some basic front-end coding style guides, so if you are looking to contribute, please follow these rules

### Styles

Styles are added via the library emotion, which is a styled-component style library. You can add a new styled component using the `react-emotion` library

```js
import styled from 'react-emotion'

const CallToAction = styled('div')`
  background: 'green';
  color: 'red';
`
```

Styles can be kept in the same file as the component you're adding them into unless they are being reused somewhere else, in that case they can be abstracted out of the file and imported like a normal component.

### Components

Components need to be inside the components folder. We are currently migrating to functional components and hooks, so all new components must be functional components and use hooks if they need state or access to external APIs. Do not use arrays to group sibling JSX, instead use the short fragment syntax `<></>`

```js

function Component({}){
  return (
    <>
      <Button>This is a button</Button>
      <OtherComponent />
    </>
  )
}


```

### Importing and exporting

For imports, we use the ES6 import syntax over commonJS. We first import all npm packages first, such as React, Emotion or Apollo. Then we group imports based on what they are and separate them with a space.

```js
import React from 'react'
import { useQuery } from 'react-apollo'

import { GET_PROFILE } from 'graphql/queries'
import { SET_PROFILE } from 'graphql/mutations'

import Button from 'components/Button'
```

For exports, we generally have one default export for components. If it makes sense to have multiple exports in a component, we generally separate than component into a new file. The only exception is a group of reusable styled components that have no specific hierarchy, such as Buttons or Inputs.

```js
//Normal component

export default function SomeComponent(){
  // component internals
}
```

```js
//reusable components

export const Button1 = styled('button')`
`

export const Button2 = styled('button')`
`
```

### Variable declaration

Generally we use `const` for everything, especially styled components. Any variable that needs to be reassigned will use `let`. `var` is not used at all throughout the code base. All variables are camel cased, unless they are a constant, in which they capitalised and snake cased. If the constant is used throughout the project, abstract the constant to an appropriate file level that all components or files can import it without going up and down the file try (should only need to go up the file tree to find the constant).

```js
const Component = styled('div')`

`

function SideBar(){
  const CONSTANT_VALUE = 42
  let reassignableVar = null
  const { data } = useQuery(QUERY) // most destructured values will use const unless otherwise needed
  
  // rest of the component
}
```

### File Naming

* All components are Pascal Cased
* All Javascript files that aren't components are camel cased
* Anything that isn't a component are also camel cased

## Setup

Clone the repo

```
git clone https://github.com/wearekickback/app.git
cd app
yarn
```

Add `src/config/env.json` with the following information

```
{
  "DEPLOYER_CONTRACT_ADDRESS": "0x9C7DbAe0A2EeF05D08E2e18Ff6173dFf7c5537eB",
  "API_URL": "https://kovan.api.kickback.events",
  "NUM_CONFIRMATIONS": 1,
  "ENV": "kovan",
  "DAI_CONTRACT_ADDRESS": "0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9"
}
```

```
yarn start
```

**Test creating a event locally**

- Go to http://localhost:3000/create
- Fill in event detail (leave password as blank)
- Fill in event detail and press "Submit"

**Automated E2E tests with cypress (Not available to public)**

Make sure the locally environment is up and running with local contract, ganache and server. When run ganache, run it with 500 accounts `ganache-cli --accounts 500 -b 3`

Run the seeding script to deploy some seed parties

```bash
$ yarn run seedParty
Creating admin profile
Deployed new party at address: 0x073c8E6c4653a150178D4Cdf501e455e55C26BA4
New rsvp 0x5656d12b67Cca4CF8d300a6d7f541bAb0965E443 at party 'Super duper'at address: 0x073c8E6c4653a150178D4Cdf501e455e55C26BA4
New rsvp 0xb37E1D697753Ee89D572d6Cf56DEfCDfb55236D5 at party 'Super duper'at address: 0x073c8E6c4653a150178D4Cdf501e455e55C26BA4
Admin account adm1547825705218 already exists
Deployed new party at address: 0xf4d12F3e5CA4D66C2196942135FDa78c8f3A90d1
New rsvp 0xb37E1D697753Ee89D572d6Cf56DEfCDfb55236D5 at party 'Super duper 2'at address: 0xf4d12F3e5CA4D66C2196942135FDa78c8f3A90d1
New rsvp 0x5656d12b67Cca4CF8d300a6d7f541bAb0965E443 at party 'Super duper 2'at address: 0xf4d12F3e5CA4D66C2196942135FDa78c8f3A90d1
Seeding parties complete!
Ready to run cypress tests
✨  Done in 14.11s.
```

NOTE: If the output does not show contract addresses, there is a possibility that the web3 version you are using [may have a bug](https://github.com/ethereum/web3.js/issues/1916). If the bug is not fixed, try to manually change the web3 js code as described [here](https://ethereum.stackexchange.com/questions/61073/uncaught-error-returned-values-arent-valid-did-it-run-out-of-gas)

```bash
$ yarn run cypress:open
```

Seed script must be re-run to test again.
