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

