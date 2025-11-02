import { GoogleAiService } from "./ai.service";
import * as fs from 'fs';
import * as path from 'path';

export class PlannerService {
    private readonly SCHEDULE_DIR = path.join(process.cwd(), 'schedule');
    private readonly FILE_PATH = path.join(this.SCHEDULE_DIR, 'planner-schedule.json');

    constructor(private readonly iaService: GoogleAiService = new GoogleAiService()) {
    }

    async healthService(): Promise<Boolean> {
        return await this.iaService.health();
    }

    async prepareSchedule(topics: string[], initialDate: string, hoursPerWeek: number, weeksQuantity: number): Promise<any> {
        const jsonString = await this.iaService.getPlanner(topics, initialDate, hoursPerWeek, weeksQuantity);

        try {
            const responseObject = JSON.parse(jsonString);
            
            const jsonOutput = JSON.stringify(responseObject, null, 2);
            
            if (!fs.existsSync(this.SCHEDULE_DIR)) {
                fs.mkdirSync(this.SCHEDULE_DIR, { recursive: true });
                console.log(`[PlannerService] Carpeta creada: ${this.SCHEDULE_DIR}`);
            }

            fs.writeFileSync(this.FILE_PATH, jsonOutput, 'utf-8');
            console.log(`[PlannerService] Planificación guardada en: ${this.FILE_PATH}`);

            return responseObject;

        } catch (e) {
            console.error("❌ Error al parsear JSON de la IA o al escribir el archivo:", e);
            throw new Error("AI returned malformed JSON or file writing failed.");
        }
    }
}
