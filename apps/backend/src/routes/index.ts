import { Router } from "express";
import eventRoutes from "./event.route";
import sessionRoutes from "./session.route";
import { GetDistinctPages } from "../controllers/session.controller";

const rootRouter = Router();

rootRouter.use('/events', eventRoutes);
rootRouter.use('/sessions', sessionRoutes);

rootRouter.get('/pages', GetDistinctPages);

export default rootRouter;
