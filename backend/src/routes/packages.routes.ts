import { Router } from "express";
import { packagesController } from "../controllers/packages.controllers";

const router = Router();

router.post('/', packagesController.createPackage.bind(packagesController));

export default router;