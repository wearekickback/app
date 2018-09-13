# Blockparty Dapp

* Dev version: https://dev.noblockno.party
* Live version: https://noblockno.party

## Dev guide


**Run the app**

Install deps:

```
yarn
```

Run the dev server:

```
yarn start
```

**Deploy our contracts to a local env n**

Startup ganache in separate terminal

```
ganache-cli
```

Run the migration

```
yarn migrate
```

**Test creating a event locally**

- Go to http://localhost:3000/create
- Open inspector on your browser
- Fill in event detail and press "Submit"
- Once transaction is complete, then get `deployedAddress` from the event.
- Go to http://localhost:3000/party/$address to see if newly created event is shown.

