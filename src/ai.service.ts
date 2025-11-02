import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
            // Simple ping test: usar un modelo mínimo para verificar disponibilidad
            await this.ai.models.get({ model: "gemini-2.5-flash" });
            return true;
        } catch (error) {
            console.error("❌ Google AI health check failed:", error);
            return false;
        }
    }

    /**
     * Genera un plan de estudio con Gemini según los parámetros indicados.
     */
    async getPlanner(
        topics: string[],
        initialDate: string,
        hoursPerWeek: number,
        weeksQuantity: number
    ): Promise<string> {
        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents:
                    `Create a study schedule based on the following parameters:\n` +
                    `Topics: ${topics.join(", ")}\n` +
                    `Initial Date: ${initialDate}\n` +
                    `Hours per Week: ${hoursPerWeek}\n` +
                    `Weeks Quantity: ${weeksQuantity}\n` +
                    `The schedule should distribute the topics evenly and include retrospective reviews.`,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0,
                    },
                },
            });

            return response.text;
        } catch (error) {
            console.error("❌ Error generating planner:", error);
            throw new Error("Failed to generate study plan");
        }
    }
}
