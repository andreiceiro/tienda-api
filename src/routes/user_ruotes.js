import { Router } from "express";

const router= Router();
import * as CtrlUser from '../controllers/user_controller';
import {AuthJWT, VerifySingUp} from '../middlewares'

router.post('/', [AuthJWT.verifyToken, VerifySingUp.IsUserOrEmailExisted, VerifySingUp.IsRolesExisted] ,CtrlUser.createUser);
router.put('/:userId', [AuthJWT.verifyToken, AuthJWT.IsAdmin, VerifySingUp.IsRolesExisted], CtrlUser.updateUserByIdSol2);
router.get('/', [AuthJWT.verifyToken, AuthJWT.IsAdmin, VerifySingUp.IsRolesExisted],CtrlUser.getUsers);
router.get('/:userId', [AuthJWT.verifyToken, AuthJWT.IsAdmin, VerifySingUp.IsRolesExisted], CtrlUser.getUserById);
router.delete('/:userId', [AuthJWT.verifyToken, AuthJWT.IsAdmin, VerifySingUp.IsRolesExisted], CtrlUser.deleteUser);

export default router;