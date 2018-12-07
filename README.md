# Kickback Dapp

- Dev version: https://dev.kickback.events
- Live version: https://kickback.events

## Dev guide

Please read [our full setup guide](https://github.com/wearekickback/docs/blob/master/RunningEverythingLocally.md)

**Test creating a event locally**

- Go to http://localhost:3000/create
- Open inspector on your browser
- Fill in event detail and press "Submit"
- Once transaction is complete, then get `deployedAddress` from the event.
- Go to http://localhost:3000/party/$address to see if newly created event is shown.

**Automated E2E tests with cypress**
Make sure the locally environment is up and running with local contract, ganache and server. When run ganache, run it with 500 accounts `ganache-cli --accounts 500`

Run the seeding script to deploy some seed parties

```bash
$ yarn run seedParty
```

```bash
$ yarn run cypress:open
```

Seed script must be re-run to test again.
