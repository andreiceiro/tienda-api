import { Router } from "express";
const router= Router();

import * as AuthCtrl from '../controllers/auth_controller';
import * as VerifySingUp from '../middlewares/verifySignUp';

router.post('/singup', [VerifySingUp.IsUserOrEmailExisted, VerifySingUp.IsRolesExisted] ,AuthCtrl.singUP);
router.post('/singin', AuthCtrl.singIN);

export default router;