import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const activitySchema = {
    type: "OBJECT",
    properties: {
        topic: { type: "STRING", description: "El tópico de estudio principal." },
        description: { type: "STRING", description: "Una descripción detallada de la actividad." },
        estimatedHours: { type: "NUMBER", description: "La duración estimada de la actividad en horas (ej: 1.5)." }
    },
    required: ["topic", "description", "estimatedHours"],
    propertyOrdering: ["topic", "description", "estimatedHours"]
};

const weekSchema = {
    type: "OBJECT",
    properties: {
        weekNumber: { type: "INTEGER", description: "El número de la semana (empezando en 1)." },
        totalHours: { type: "NUMBER", description: "La suma exacta de estimatedHours para esta semana." },
        activities: { 
            type: "ARRAY", 
            items: activitySchema, 
            description: "Una lista de actividades de estudio para esta semana." 
        }
    },
    required: ["weekNumber", "totalHours", "activities"],
    propertyOrdering: ["weekNumber", "totalHours", "activities"]
};


/**
 * Servicio que interactúa con la API de Gemini
 * para generar contenido basado en parámetros de estudio.
 */
export class GoogleAiService {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.API_KEY_GEMINI;
        if (!apiKey) {
            throw new Error("❌ API_KEY_GEMINI is not defined in environment variables");
        }
        this.ai = new GoogleGenAI({ apiKey });
    }

    /**
     * Verifica si la API de Gemini está operativa.
     */
    async health(): Promise<boolean> {
        try {
            await this.ai.models.get({ model: "gemini-2.5-flash" });
            return true;
        } catch (error) {
            console.error("❌ Google AI health check failed:", error);
            return false;
        }
    }

    /**
     * Genera un plan de estudio con Gemini, forzando la salida a un JSON estructurado.
     */
    async getPlanner(
        topics: string[],
        initialDate: string,
        hoursPerWeek: number,
        weeksQuantity: number
    ): Promise<string> {
        try {
            const prompt = 
                `Crea un horario de estudio JSON estricto basado en los siguientes parámetros:\n` +
                `Topics: ${topics.join(", ")}\n` +
                `Initial Date: ${initialDate}\n` +
                `Hours per Week: ${hoursPerWeek}\n` +
                `Weeks Quantity: ${weeksQuantity}\n` +
                `El horario debe distribuir los tópicos equitativamente y DEBE incluir al menos una actividad de 'repaso' o 'evaluación'. La carga total de horas de cada semana (totalHours) debe coincidir exactamente con Hours per Week (${hoursPerWeek}).`;
            
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0,
                    },
                    // *** CONFIGURACIÓN CLAVE PARA FORZAR JSON ***
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: weekSchema
                    }
                    // ********************************************
                },
            });

            // La respuesta.text ahora contiene la cadena JSON limpia
            return response.text;
        } catch (error) {
            console.error("❌ Error generating planner:", error);
            throw new Error("Failed to generate study plan");
        }
    }
}
