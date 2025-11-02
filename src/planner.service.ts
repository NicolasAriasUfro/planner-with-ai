import { GoogleAiService} from "./ai.service";

export class PlannerService {
    constructor(private readonly iaService:GoogleAiService = new GoogleAiService) {
    }

    async healthService(): Promise<Boolean> {
        return await this.iaService.health();
    }

    async prepareSchedule(topics: string[], initialDate: string, hoursPerWeek: number, weeksQuantity: number): Promise<string> {
        return await this.iaService.getPlanner(topics, initialDate, hoursPerWeek, weeksQuantity)
    }
}
