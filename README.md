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
