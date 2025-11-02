describe('Health Service planning', () => {
  it('passes', () => {
    cy.request('http://localhost:3000/health-service').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.service).to.eq('Health Service');
    })
  })
})