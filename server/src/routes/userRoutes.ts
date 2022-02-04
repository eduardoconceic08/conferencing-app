import { Router } from 'express';
import passportStrategyJWT from '../middlewares/authMiddleware';
import userController from '../controllers/userController';

const userRouter: Router = Router();

userRouter.post('/change-password', passportStrategyJWT, userController.changePasswordPost);
userRouter.get('/:userEmail', passportStrategyJWT, userController.findUsersByEmailGet);

export default userRouter;
