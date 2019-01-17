import _ from 'lodash'

function stubTracking() {
  cy.server() // enable response stubbing
  cy.route({
    method: 'GET',
    url: '/track/*',
    response: true
  })
  cy.route({
    method: 'GET',
    url: '/decide/*',
    response: true
  })
}

function signIn() {
  cy.getByTestId('sign-in-modal').within(() => {
    cy.getByText('Sign in', { exact: false }).should('exist')
    cy.getByTestId('sign-in-button').click()
  })
}

function finalise() {
  cy.queryByText('Finalize', { exact: false }).click()
  cy.queryByText('Finalize and enable payouts', { exact: false }).click()
}

beforeEach(() => {
  stubTracking()
})

const CONFIRMATION_TIME = 15000
const randomAccount = _.random(5, 500)

describe('Sign up', () => {
  it('sign up', () => {
    cy.visit(`http://localhost:3000/events?account=${randomAccount}`)
    const username = `joel${randomAccount}`
    cy.getByText('Sign in', { exact: false }).click()
    cy.get('input[data-testid="username"]').type(username)
    cy.get('input[data-testid="realname"]').type('Joel Bloggs')
    cy.get('input[data-testid="email"]').type('joel@gmail.com')
    cy.get('input[data-testid="terms"]').click()
    cy.get('input[data-testid="privacy"]').click()
    cy.get('input[data-testid="marketing"]').click()
    cy.queryByTestId('sign-in-button').click()
    cy.queryByTestId('userprofile-name').should('have.text', username)
  })
})

describe('Admin create, RSVP and finalise', () => {
  it('Admin create, RSVP and finalise', () => {
    cy.visit(`http://localhost:3000/create?account=${randomAccount}`)
    const eventName = `Super awesome event ${randomAccount}`
    // Fill in form
    cy.getByLabelText('Name')
      .click()
      .type(eventName)
    cy.getByLabelText('Description')
      .click()
      .type('This is going to be a great event')
    cy.getByLabelText('Location')
      .click()
      .type('London')
    cy.getByLabelText('Dates')
      .click()
      .type('12 September 2020')
    cy.getByLabelText('Image')
      .click()
      .type(
        'https://coinnounce.com/wp-content/uploads/2018/08/the-next-ethereum-hard-fork-constantinople-all-you-need-to-know.jpg'
      )
    // Deploy pending event to server //
    cy.getByText('Create Pending Party').click()
    signIn()
    // Deploy to network //
    cy.getByText('Deploy').click()
    cy.wait(CONFIRMATION_TIME)
    cy.getByText('Events', { timeout: CONFIRMATION_TIME }).click()
    cy.getByText(eventName).click()
    // Assert information exists //
    cy.getByText(eventName).should('exist')
    cy.getByText('This is going to be a great event').should('exist')
    cy.getByText('London').should('exist')
    cy.getByText('12 September 2020').should('exist')

    cy.queryByText('RSVP -', { exact: false }).click()
    cy.queryByText('1 going', {
      exact: false,
      timeout: CONFIRMATION_TIME
    }).should('exist')

    // Finalise Event //
    cy.queryByText('Finalize', { exact: false }).click()
    cy.queryByText('Finalize and enable payouts', { exact: false }).click()
    cy.wait(CONFIRMATION_TIME)
    cy.getByText('Finalized!', {
      exact: false,
      timeout: CONFIRMATION_TIME
    }).should('exist')
  })
})

xdescribe('Party with 2 people, one mark attended, one not', () => {
  it('Admin create, RSVP and finalise', async () => {
    cy.visit('http://localhost:3000/')
    cy.getByText('Events').click()
    cy.getByText('Super duper').click()

    //TODO: expect there to be 2 participants

    //Get Attendee box
    cy.queryByText('makoto')
      .parent()
      .parent()
      .within(container => {
        cy.getByText('Mark Attended', {
          container,
          exact: false
        }).click()
      })

    //TODO: expect there to be one marked attended

    signIn()
    finalise()
    cy.getByText('Finalized', {
      timeout: CONFIRMATION_TIME,
      exact: false
    }).should('exist')

    //TODO: assert on payouts displayed are correct
  })
})
