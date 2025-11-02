context("GET /planner", () => {
    it('should return a plan of study', () => {
        const body  = {
            "topics": ["matemáticas"],
            "initialDate": "2025-10-22T17:25:00",
            "hoursPerWeek": 6,
            "weeksQuantity": 4
        }


        cy.request('http://localhost:3000/planner', body).then((res) => {
            expect(res.status).to.eq(200)
        })
    });
})