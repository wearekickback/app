import getWeb3 from '../../api/web3'
import assist from 'bnc-assist'

const Assist = async ({ expectedNetworkId }) => {
  const web3 = await getWeb3()
  let assistInstance = assist.init({
    dappId: 'c212885d-e81d-416f-ac37-06d9ad2cf5af',
    minimumBalance: '10000',
    web3: web3,
    networkId: expectedNetworkId,
    images: {
      welcome: {
        src: 'https://kickback.events/card.png',
        srcset: 'Welcome to Kickback'
      },
      complete: {
        src: 'https://kickback.events/card.png',
        srcset: 'Now you are ready to use Kickback'
      }
    }
  })
  assistInstance.getState().then(function(state) {
    console.log({ state })
    if (state.mobileDevice) {
      console.log('this is mobile')
    } else {
      console.log('this is desktop')
      assistInstance
        .onboard()
        .then(function(success) {
          console.log({ success })
        })
        .catch(function(error) {
          console.log({ error })
        })
    }
  })
}
export default Assist
