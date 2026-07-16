import { Router } from 'express';
import * as ServiceCtrl from '../controllers/service.controller';
import { protect, restrictTo } from '../../../shared/middlewares/auth.middleware';

const ServiceRouter = Router();

ServiceRouter.use(protect);

ServiceRouter.get('/my-bookings', ServiceCtrl.getMyBookings);
ServiceRouter.post('/book', ServiceCtrl.requestBooking);
ServiceRouter.post('/confirm', ServiceCtrl.confirmService);

ServiceRouter.post('/shops/:shopId/offers', restrictTo('merchant', 'admin'), ServiceCtrl.offerService);

export default ServiceRouter;