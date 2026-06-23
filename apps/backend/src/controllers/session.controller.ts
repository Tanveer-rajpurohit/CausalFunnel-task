import { Request, Response } from "express";
import * as SessionService from "../services/session.service";

export const GetSessions = async (req: Request, res: Response) => {
    try {
        
        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;
        
        const sortByField = req.query.sortBy === "lastActive" ? "lastActive" : "eventCount";
        const sortOrder = req.query.order === "asc" ? 1 : -1;
        
        const result = await SessionService.getSessionsList(sortByField, sortOrder as 1 | -1, limit, skip);

        res.status(200).json({ 
            success: true, 
            data: result.sessions,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(result.totalRecords / limit),
                totalRecords: result.totalRecords
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetSessionEvents = async (req: Request, res: Response) => {
    try {
        const sessionId = req.params.sessionId as string;
        const type = req.query.type as string;
        
        if (!sessionId) {
            res.status(400).json({ success: false, message: "Session ID is required" });
            return;
        }

        const events = await SessionService.getSessionEvents(sessionId, type);
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetDistinctPages = async (req: Request, res: Response) => {
    try {
        const pages = await SessionService.getDistinctPages();
        res.status(200).json({ success: true, data: pages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
