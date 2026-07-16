import { Router } from "express";
import AuthRouter from "./auth.router";
import BankRouter from "./bank.router";
import AdminRouter from "../../admin-service/routes/admin.router";
import GeneralRouter from "../../commerce-service/routes/routes";

const router = Router();

router.use('/auth', AuthRouter);
router.use('/bank', BankRouter);

router.use('/general', GeneralRouter);

router.use('/admin', AdminRouter);

export default router;