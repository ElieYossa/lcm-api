import { Router } from "express";
import Comrouter from "./commerce.router";
import OrderRouter from "./order.router";
import Driverrouter from "./driver.router";
import ServiceRouter from "./service.router";

const GeneralRouter = Router();

GeneralRouter.use('/commerce', Comrouter);
GeneralRouter.use('/orders', OrderRouter);
GeneralRouter.use('/driver', Driverrouter);
GeneralRouter.use('/services', ServiceRouter);

export default GeneralRouter;