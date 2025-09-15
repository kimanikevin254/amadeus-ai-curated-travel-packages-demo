import { Router } from "express";
import { citySearchController } from "../controllers/city-search.controller";

const router = Router();

router.get('/', citySearchController.searchCities.bind(citySearchController));

export default router;