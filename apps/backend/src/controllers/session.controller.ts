import { Request, Response } from "express";
import * as SessionService from "../services/session.service";

export const GetSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await SessionService.getSessionsList();
        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetSessionEvents = async (req: Request, res: Response) => {
    try {
        const sessionId = req.params.sessionId as string;
        if (!sessionId) {
            res.status(400).json({ success: false, message: "Session ID is required" });
            return;
        }

        const events = await SessionService.getSessionEvents(sessionId);
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
