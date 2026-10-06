import express from "express";

import BookingController from "../controllers/bookings.controller.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validation.middleware.js";
import {
  bookingSchema,
  addServiceToBookingSchema,
} from "../validations/booking.validation.js";

const router = express.Router();

const bookingController = new BookingController();

router.post("/", validateBody(bookingSchema), bookingController.createBooking);

router.get("/:id", bookingController.getBookingById);

router.post(
  "/:bid/services/:sid",
  validateParams(addServiceToBookingSchema),
  bookingController.addServiceToBooking,
);

export default router;
