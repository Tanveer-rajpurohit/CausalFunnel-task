import { Router } from "express";
import { CreateEvent, GetHeatmap } from "../controllers/event.controller";

const eventRoutes: Router = Router();

eventRoutes.post('/', CreateEvent)
eventRoutes.get('/heatmap', GetHeatmap)

export default eventRoutes;