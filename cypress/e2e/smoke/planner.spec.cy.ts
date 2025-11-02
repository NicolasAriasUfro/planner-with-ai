context( "/planner", () => {
    it("should return a plan of study", () => {
        const body = {
            topics: ["matemáticas"],
            initialDate: "2025-10-22T17:25:00",
            hoursPerWeek: 6,
            weeksQuantity: 4,
        };

        cy.request("POST", "http://localhost:3000/planner", body).then((res) => {
            expect(res.status).to.eq(200);
        });
    });

    it("should return 400 when missing required parameters: initialDate", () => {
        const body = {
            topics: ["matemáticas"],
            hoursPerWeek: 6,
            weeksQuantity: 4,
        };

        cy.request({
            method: "POST",
            url: "http://localhost:3000/planner",
            body,
            failOnStatusCode: false, // evita que Cypress falle automáticamente en códigos != 2xx
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.include("Missing required parameters");
            expect(res.body.error).to.include("initialDate");
        });
    });
    it("should return 400 when missing required parameters: hoursPerWeek", () => {
        const body = {
            topics: ["matemáticas"],
            initialDate: "2025-10-22T17:25:00",
            weeksQuantity: 4,
        };

        cy.request({
            method: "POST",
            url: "http://localhost:3000/planner",
            body,
            failOnStatusCode: false, // evita que Cypress falle automáticamente en códigos != 2xx
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.include("Missing required parameters");
            expect(res.body.error).to.include("hoursPerWeek");
        });
    });
    it("should return 400 when missing required parameters: topics", () => {
        const body = {
            initialDate: "2025-10-22T17:25:00",
            weeksQuantity: 4,
            hoursPerWeek:6
        };

        cy.request({
            method: "POST",
            url: "http://localhost:3000/planner",
            body,
            failOnStatusCode: false, // evita que Cypress falle automáticamente en códigos != 2xx
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.include("Missing required parameters");
            expect(res.body.error).to.include("topics");
        });
    });
    it("should return 400 when missing required parameters: weeksQuantity", () => {
        const body = {
            topics: ["matemáticas"],
            initialDate: "2025-10-22T17:25:00",
            hoursPerWeek: 6,
        };

        cy.request({
            method: "POST",
            url: "http://localhost:3000/planner",
            body,
            failOnStatusCode: false, // evita que Cypress falle automáticamente en códigos != 2xx
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property("error");
            expect(res.body.error).to.include("Missing required parameters");
            expect(res.body.error).to.include("weeksQuantity");
        });
    });
});
