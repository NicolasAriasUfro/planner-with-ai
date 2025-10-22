import express from 'express';
import { prepareSchedule} from "./planner.service";
const app = express();
const port = 3000;

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*
Endpoints for planner features
recibe un array of topics and start time
number of hours wekly available
a total amount of weeks to planner
returns a schedule with topics distributed in the available time
 */
app.get("/planner", async (req, res) => {
    // Validation
    console.log(req.body)
    const topics = req.body.topics;
    const initialDate = req.body.initialDate;
    const hoursPerWeek = req.body.hoursPerWeek;
    const weeksQuantity = req.body.weeksQuantity;
    
    // Check if all required parameters are present
    if (!topics || !initialDate || !hoursPerWeek || !weeksQuantity) {
        return res.status(400).json({
            error: "Missing required parameters. Required: topics, initialDate, hoursPerWeek, weeksQuantity"
        });
    }
    
    // Validate topics is an array of strings
    if (!Array.isArray(topics) || topics.length === 0 || !topics.every(topic => typeof topic === 'string')) {
        return res.status(400).json({
            error: "topics must be a non-empty array of strings"
        });
    }
    
    // Validate initialDate is a string
    if (typeof initialDate !== 'string' || initialDate.trim() === '') {
        return res.status(400).json({
            error: "initialDate must be a non-empty string"
        });
    }
    
    // Validate hoursPerWeek is a positive number
    if (typeof hoursPerWeek !== 'number' || hoursPerWeek <= 0) {
        return res.status(400).json({
            error: "hoursPerWeek must be a positive number"
        });
    }
    
    // Validate weeksQuantity is a positive number
    if (typeof weeksQuantity !== 'number' || weeksQuantity <= 0) {
        return res.status(400).json({
            error: "weeksQuantity must be a positive number"
        });
    }
    
    try {
        const response = await prepareSchedule(topics, initialDate, hoursPerWeek, weeksQuantity);
        res.json({ response });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error while generating schedule"
        });
    }
})

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});