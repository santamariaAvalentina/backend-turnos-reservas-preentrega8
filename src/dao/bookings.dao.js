import { BookingModel } from "./models/booking.model.js";

export class BookingsDAO {

    async getAll() {
        return await BookingModel.find().lean();
    }

    async getById(id) {
        return await BookingModel.findById(id)
            .populate("services.service")
            .lean();
    }

    async create(booking) {
        return await BookingModel.create(booking);
    }

    async update(id, updatedBooking) {
        return await BookingModel.findByIdAndUpdate(
            id,
            { $set: updatedBooking },
            { new: true }
        );
    }
}