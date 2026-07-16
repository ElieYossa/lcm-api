import { Router } from "express";
import AdminRouter from "./admin.router";

const router = Router();

router.use('/admin', AdminRouter);

export default router;