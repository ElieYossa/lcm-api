import { Router } from 'express';
import * as DriverCtrl from '../controllers/driver.controller';
import { protect, restrictTo } from '../../../shared/middlewares/auth.middleware';

const Driverrouter = Router();

Driverrouter.use(protect);
Driverrouter.use(restrictTo('driver', 'admin'));

Driverrouter.get('/available-orders', DriverCtrl.listAvailable);
Driverrouter.get('/my-active', DriverCtrl.getMyDeliveries);      

Driverrouter.post('/accept', DriverCtrl.acceptOrder);
Driverrouter.patch('/location', DriverCtrl.updateGPS); 
Driverrouter.patch('/pickup/:deliveryId', DriverCtrl.markAsPickedUp);
Driverrouter.patch('/arrived/:deliveryId', DriverCtrl.markAsArrived);

export default Driverrouter;