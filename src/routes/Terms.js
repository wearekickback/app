import React, { Component } from 'react'

class Terms extends Component {
  render() {
    return (
      <div className="terms">
        <h1>Terms and conditions</h1>

        <h2>Generic policy</h2>
        <p>To be added.</p>

        <h2>Refund policy</h2>
        <p>
            Kickback software requires that you commit a small amount when you RSVP to reserve your spot.
Event attendance is determined by the event organisers or an event admin.
        </p>

        <p>
        Following the event
            <ul>
                <li>
                    If the event organisers will check you in you will receive notification via email or twitter (based on your registration). Typically you have limited time window or “cooling period” (default is one week but the duration may vary) to withdraw your funds from the event smart contract. After the cooling period has passed, you acknowledge that you are not interested in retrieving your funds and the smart contract owner has the right to clear the remaining funds according to the rule specified in the smart contract.
                </li>
                <li>
                    If the event organiser did not check you in, you will lose any funds you committed. These funds will be divided among the event attendees or they can be applied in other ways (charitable contribution, sponsorship of future events etc)
                </li>
            </ul>
        </p>

        <p>
            If you did not register a correct email or twitter address during signup process, we have no way to notify you when/whether you are able to withdraw funds. If this is the case, it is your responsibility to visit our website and confirm the status of the funds.
            In case the organizer decides to cancel the event, you will be able to withdraw funds, but will be again required to do so within the time window of the “cooling period” (default is one week but the duration may vary)
            In case the smart contract is exploited due to bugs or its account was compromised, you will not be compensated for your loss.
        </p>
      </div>
    )
  }
}

export default Terms
