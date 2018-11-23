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

beforeEach(() => {
  stubTracking()
})

const CONFIRMATION_TIME = 12000

describe('Admin create, RSVP and finalise', async () => {
  it('Admin create, RSVP and finalise', async () => {
    cy.visit('http://localhost:3000/create')

    // Fill in form
    cy.getByLabelText('Name')
      .click()
      .type('Super awesome event')
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
    cy.getByTestId('sign-in-modal').within(() => {
      cy.getByText('Sign in', { exact: false }).should('exist')
      cy.getByTestId('sign-in-button').click()
    })
    // Deploy to network //
    cy.getByText('Deploy').click()
    cy.wait(CONFIRMATION_TIME)
    cy.getByText('View event page').click()

    // Assert information exists //
    cy.getByText('Super awesome event').should('exist')
    cy.getByText('This is going to be a great event').should('exist')
    cy.getByText('London').should('exist')
    cy.getByText('12 September 2020').should('exist')

    cy.queryByText('RSVP -', { exact: false }).click()
    cy.wait(CONFIRMATION_TIME)
    cy.queryByText('1 going', { exact: false })

    // Finalise Event //
    cy.queryByText('Finalize', { exact: false }).click()
    cy.queryByText('Finalize and enable payouts', { exact: false }).click()
    cy.wait(CONFIRMATION_TIME)

    cy.getByText('Finalized').should('exist')
  })
})

//TODO: Create a secont event other users can RSVP for
// describe('User logged in', () => {
//   it('Navigate to event page and click rsvp', async () => {
//     stubTracking()
//     cy.visit('http://localhost:3000')
//     cy.getByText('Say hello to Kickback!').should('exist')
//     cy.queryByText('Events').click()
//     cy.url().should('include', '/events')
//     cy.get('li:first-child a').then(event => {
//       event.click()
//     })
//     cy.url().should('include', '/event')
//     cy.queryByText('RSVP -', { exact: false }).click()
//     cy.queryByText('Please ensure your browser is connected')
//   })
// })
