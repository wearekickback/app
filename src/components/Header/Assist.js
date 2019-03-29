import assist from 'bnc-assist'

const Assist = ({ expectedNetworkId }) => {
  console.log('ASSIST')
  console.log({ expectedNetworkId })
  let assistInstance = assist.init({
    dappId: 'c212885d-e81d-416f-ac37-06d9ad2cf5af',
    networkId: expectedNetworkId
  })
  assistInstance.getState().then(function(state) {
    if (state.mobileDevice) {
      console.log('this is mobile')
    } else {
      console.log('this is desktop')
      assistInstance
        .onboard()
        .then(function(success) {
          console.log({ success })
          // User has been successfully onboarded and is ready to transact
          // This means we can be sure of the follwing user properties:
          //  - They are using a compatible browser
          //  - They have a web3-enabled wallet installed
          //  - The wallet is connected to the config-specified networkId
          //  - The wallet is unlocked and contains at least `minimumBalance` in wei
          //  - They have connected their wallet to the dapp, congruent with EIP1102
        })
        .catch(function(error) {
          // The user exited onboarding before completion
          // Will let you know which stage of onboarding the user reached when they exited
          console.log('catch***')
          console.log(error.msg)
        })
    }
  })
}
export default Assist
