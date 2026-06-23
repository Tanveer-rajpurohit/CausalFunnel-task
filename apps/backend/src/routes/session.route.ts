import { Router } from "express";
import { GetSessions, GetSessionEvents } from "../controllers/session.controller";

const sessionRoutes: Router = Router();

sessionRoutes.get('/', GetSessions);
sessionRoutes.get('/:sessionId/events', GetSessionEvents);

export default sessionRoutes;