import { Router } from "express";
import * as CtrlProduct from "../controllers/products_controller";
import {AuthJWT} from '../middlewares'

const router= Router();

router.get('/', [AuthJWT.verifyToken, AuthJWT.IsAdminOrUser], CtrlProduct.getProducts);

router.get('/:prodId', [AuthJWT.verifyToken, AuthJWT.IsAdminOrUser], CtrlProduct.getProductById);

router.post('/', [AuthJWT.verifyToken, AuthJWT.IsAdminOrUser], CtrlProduct.createProduct);

router.put('/:prodId', [AuthJWT.verifyToken, AuthJWT.IsAdminOrUser], CtrlProduct.updateProductById);

router.delete('/:prodId', [AuthJWT.verifyToken, AuthJWT.IsAdminOrUser], CtrlProduct.deleteProductById);

export default router;