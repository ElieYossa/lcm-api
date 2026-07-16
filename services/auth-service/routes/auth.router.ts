import { Router } from 'express';
import { register, login, logout, refresh, getProfile, updateProfile } from '../controllers/auth.controller';
import { protect } from '../../../shared/middlewares/auth.middleware';

const AuthRouter = Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/refresh-token', refresh);

AuthRouter.get('/profile', protect, getProfile);
AuthRouter.patch('/profile', protect, updateProfile);
AuthRouter.post('/logout', protect, logout);



export default AuthRouter;