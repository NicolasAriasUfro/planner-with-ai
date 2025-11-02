import {GoogleGenAI} from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

export async function getPlanner(topics:string[], initialDate:string, hoursPerWeek:number, weeksQuantity:number){

    const ai = new GoogleGenAI({apiKey:process.env.API_KEY_GEMINI!});

    const response = await ai.models.generateContent({
        model:  'gemini-2.5-flash',
        contents: "Create a study schedule based on the following parameters: \n" +
            "Topics: " + topics.join(", ") + "\n" +
            "Initial Date: " + initialDate + "\n" +
            "Hours per Week: " + hoursPerWeek + "\n" +
            "Weeks Quantity: " + weeksQuantity + "\n" +
            "The schedule should distribute the topics evenly over the available time and provide specific study sessions for each topic." +
            "additionally, consider a retrospective review to consolidate learning. ",
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
                // Turn off thinking:
                // thinkingBudget: 0
                // Turn on dynamic thinking:
                // thinkingBudget: -1
            },
        },
    })

    //console.log(response.text);
    return response.text;

}