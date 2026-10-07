import express from "express";
import ServiceController from "../controllers/services.controller.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import {
  serviceSchema,
  updateServiceSchema,
} from "../validations/service.validation.js";

const router = express.Router();

const serviceController = new ServiceController();

router.get("/", serviceController.getServices);

router.post("/", validateBody(serviceSchema), serviceController.createService);

router.get("/:id", serviceController.getServiceById);

router.put(
  "/:id",validateBody(serviceSchema),serviceController.updateService,);
router.patch("/:id",validateBody(updateServiceSchema),serviceController.updateService,);

router.delete("/:id", serviceController.deleteService);

export default router;
