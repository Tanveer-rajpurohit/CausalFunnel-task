import { Router } from "express";
import eventRoutes from "./event.route";
import sessionRoutes from "./session.route";

const rootRouter = Router();

rootRouter.use('/events', eventRoutes);
rootRouter.use('/sessions', sessionRoutes);

export default rootRouter;
