import React, { Component } from 'react'

class FAQ extends Component {
  render() {
    return (
      <div className="faq">
        <h1>FAQ</h1>
        <h2>In general</h2>

        <h3>How does Kickback work?</h3>
        <p>
          Everyone commits a small amount of ETH (or MATIC) when they RSVP, which is
          refunded after the event check-in. Any no-shows lose their ETH (or MATIC), which
          can then be split amongst the attendees. To see the demo, please check
          out our{' '}
          <a href="https://www.youtube.com/channel/UCEpD7t7AbqeKlzMpIRWZILQ">
            Youtube channel
          </a>
          .
        </p>
        <h3>Can I cancel my registration?</h3>
        <p>No.</p>
        <h3>What happens if the event is canceled?</h3>
        <p>
          In case the event is canceled, all registered people can withdraw
          their pre-committed ETH (or MATIC). Make sure that you sign up with the correct
          email address so that the host can notify you.
        </p>
        <h3 id="cooling">What is the cooling period?</h3>
        <p>
          The cooling period is a limited time window (by default this is one
          week but the duration may vary) to withdraw your payout. After the
          cooling period has passed, you acknowledge that you are not interested
          in retrieving your funds and the event owner has the right to clear
          the remaining pot.
        </p>
        <h3>
          I don't feel comfortable associating my profile photo to my ETH
          address.
        </h3>
        <p>
          The profile photo is optional. It is associated to your Twitter Avatar
          which you provide during signup.
        </p>

        <h2>For event organisers</h2>
        <h3>Can I host a private event?</h3>
        <p>
          Depending on how "private" you want it to be. We can delist your event
          from our event listing page. We currently do not have a feature to
          whitelist people. However, if your event is invite-only event and you
          have attendees' email address, you can simply state that registration
          will be unqualified (and hence they lose their committed ETH) if their
          signed up email address with Kickback don't match with the ones in the
          invitation list.
        </p>
        <h3>Can I ask participants to commit DAI or other ERC20 tokens?</h3>
        <p>
          Yes! We support any ERC20 token which follows the{' '}
          <a href="https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20Detailed">
            ERC20Detailed
          </a>{' '}
          standard.{' '}
        </p>
        <h3>Can I use Kickback to receive payments for tickets yet?</h3>
        <p>Not yet.</p>
        <h3>My event participants may not have ETH (or MATIC). What should I do?</h3>
        <p>
          If your event is a blockchain related event, Kickback is actually a
          good reason for people who have no ETH to actually try to acquire one.
          If you are really worried about alienating newbies, then we would
          suggest that you asked these people who are impossible to acquire ETH
          to contact you so that you can make exceptions for them. The whole
          reason for asking to commit ETH is to prevent people who have no
          intention of showing up from taking up spots so it is unlikely that
          this backdoor will be abused.
        </p>
        <h3>Can I have multiple tiered ticketing</h3>
        <p>
          We don't natively support such features but you can simply create
          multiple events on Kickback or mix with other ticketing platform.
        </p>
        <p>
          It is a common practice to use multiple ticketing systems when you try
          out Kickback for the first time at a smaller scale. If you decide to
          go for this approach we recommend that you don't announce both tickets
          side by side as people just try to signup with less constraint
          ticketing systems. What we do recommend is that you announce your
          event with Kickback first for "early birds" ticketing, then use others
          for last minute left over spots.
        </p>
        <h3>I have other questions!</h3>
        <p>Please feel free to contact us at hello@kickback.events</p>
      </div>
    )
  }
}

export default FAQ
