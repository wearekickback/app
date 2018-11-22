describe('User not logged in', () => {
  it('Navigate to event page and click rsvp', async () => {
    cy.visit('http://localhost:3000')
    cy.getByText('Say hello to Kickback!').should('exist')
    cy.queryByText('Events').click()
    cy.url().should('include', '/events')
    cy.get('li:first-child a').then(event => {
      event.click()
    })
    cy.url().should('include', '/event')
    cy.queryByText('RSVP -', { exact: false }).click()
    cy.queryByText('Please ensure your browser is connected')
  })
})
