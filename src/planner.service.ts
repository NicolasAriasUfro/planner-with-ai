import {getPlanner} from "./ai.service";

export async function prepareSchedule(topics: string[], initialDate: string, hoursPerWeek: number, weeksQuantity: number): Promise<string> {

    return await getPlanner(topics, initialDate, hoursPerWeek, weeksQuantity)
}
