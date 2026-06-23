import { Request, Response } from "express";
import { eventValidationSchema } from "../types/schema/schema.type";
import * as EventService from "../services/event.service"; // 1. Added import

export const CreateEvent = async (req: Request, res: Response) => {
    try {                                                                                                                
        const parsedData = eventValidationSchema.parse(req.body);                                                    
        const newEvent = await EventService.saveEvent(parsedData);                                                   
        res.status(201).json({ success: true, data: newEvent }); 
    } catch (error) {                                                                                                 
        res.status(400).json({ success: false, message: error });                                                    
    }
};

export const GetHeatmap = async (req: Request, res: Response) => {
    try {
        const pageUrl = req.query.url as string; 
        const sessionId = req.query.sessionId as string;
        
        if (!pageUrl) {
            res.status(400).json({ success: false, message: "URL parameter is required" });
            return;
        }

        const heatmap = await EventService.getHeatmap(pageUrl, sessionId);
        
        res.status(200).json({ success: true, data: heatmap });
    } catch (error) {
        res.status(400).json({ success: false, message: error });
    }
};
