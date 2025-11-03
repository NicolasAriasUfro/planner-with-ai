context( "/planner - Coherencia del Plan (Refactorizado)", () => {
    const standardBody = {
        topics: ["matemáticas", "programación", "inglés técnico"],
        initialDate: "2025-10-22T17:25:00",
        hoursPerWeek: 8,
        weeksQuantity: 3,
    };
    const endpoint = "http://localhost:3000/planner";
    const weeklyLoadTolerance = 0.1; 
    
    let schedule; 

    before( "Realizar una sola petición y validar el status 200 y guardar JSON", () => {
        cy.request("POST", endpoint, standardBody).then((res) => {
            expect(res.status).to.eq(200, "La solicitud debe retornar un código 200 OK.");
            
            let rawBody = res.body;

            if (typeof rawBody === 'object' && !Array.isArray(rawBody) && rawBody !== null) {
                const arrayKey = Object.keys(rawBody).find(key => Array.isArray(rawBody[key]));
                
                if (arrayKey) {
                    schedule = rawBody[arrayKey];
                    Cypress.log({
                        name: 'Extract',
                        message: `Schedule array found under key: '${arrayKey}'`,
                    });
                } else {
                    throw new Error(`[CRÍTICO] La respuesta es un Objeto, pero no se encontró ninguna propiedad de Array dentro (Claves: ${Object.keys(rawBody).join(', ')}). Se esperaba un Array de alto nivel.`);
                }
            } else {
                schedule = rawBody;
            }

            expect(schedule).to.be.an('array', 'La respuesta debe ser un Array (el schedule) ya parseado por Cypress.');
        });
    });

    it("debería devolver el número exacto de semanas solicitadas (weeksQuantity)", () => {
        const requestedWeeks = standardBody.weeksQuantity;
        
        expect(schedule).to.be.an('array', "El plan de estudios debe ser un array de semanas.");
        expect(schedule).to.have.length(requestedWeeks, 
            `Se esperaban ${requestedWeeks} semanas en el plan.`
        );
    });

    it("debería incluir todos los tópicos solicitados en el plan de estudio (topics)", () => {
        const expectedTopics = standardBody.topics.map(t => t.toLowerCase());
        const plannedTopics = new Set();
        
        schedule.forEach(week => {
            expect(week).to.have.property('activities').that.is.an('array');
            
            week.activities.forEach(activity => {
                expect(activity).to.have.property('topic');
                
                expect(activity.topic).to.be.a('string', `Cada actividad debe tener una propiedad 'topic' de tipo string.`);

                plannedTopics.add(activity.topic.toLowerCase());
            });
        });

        expectedTopics.forEach(topic => {
            expect(plannedTopics.has(topic), 
                `Se esperaba encontrar el tópico: '${topic}' planificado.`
            ).to.be.true;
        });
    });

    it("debería asegurar que cada semana tiene actividades y que sus descripciones/horas son válidas", () => {
        schedule.forEach((week, weekIndex) => {
            const weekLabel = `Semana ${weekIndex + 1}`;
            
            expect(week.activities).to.be.an('array').and.to.have.length.above(0, 
                `${weekLabel} debe contener al menos una actividad.`
            );
            
            week.activities.forEach((activity, activityIndex) => {
                const activityLabel = `${weekLabel}, Actividad ${activityIndex + 1} (${activity.topic || 'sin tópico'})`;
                
                expect(activity.description).to.be.a('string').and.to.not.be.empty, 
                    `${activityLabel} debe tener una descripción no vacía.`;
                
                expect(activity.estimatedHours).to.to.be.a('number').and.to.be.greaterThan(0, 
                    `${activityLabel} debe tener 'estimatedHours' > 0.`
                );
            });
        });
    });

    it("debería respetar la dedicación semanal solicitada dentro de la tolerancia definida (hoursPerWeek)", () => {
        const expectedHours = standardBody.hoursPerWeek;
        
        schedule.forEach((week, weekIndex) => {
            expect(week).to.have.property('totalHours');
            const weekHours = week.totalHours;
            const weekLabel = `Semana ${weekIndex + 1}`;

            expect(weekHours).to.be.a('number', `${weekLabel}: La propiedad 'totalHours' debe ser un número.`);

            expect(weekHours).to.be.closeTo(expectedHours, weeklyLoadTolerance, 
                `${weekLabel}: Carga total de horas (${weekHours}) debe ser cercana a ${expectedHours} (Tolerancia: +/- ${weeklyLoadTolerance}).`
            );
        });
    });

    it("debería incluir al menos una actividad de repaso o evaluación en el plan completo", () => {
        let hasReviewOrEvaluation = false;
        const reviewKeywords = ["review", "evaluation", "repaso", "evaluación", "examen", "quiz", "assessment"];

        schedule.forEach(week => {
            week.activities.forEach(activity => {
                const text = (activity.topic + " " + activity.description).toLowerCase();
                if (reviewKeywords.some(keyword => text.includes(keyword))) {
                    hasReviewOrEvaluation = true;
                }
            });
        });

        expect(hasReviewOrEvaluation).to.be.true, 
            "El plan no contiene ninguna actividad con palabras clave de repaso o evaluación.";
    });
});
