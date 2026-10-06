import { ServicesService } from "../services/services.service.js";
import { BookingsService } from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export default class ViewsController {
  async getServicesView(req, res) {
    try {
      const result = await servicesService.getServices();

      res.render("services", { services: result.services });
    } catch (error) {
      res.status(500).send("Error al cargar los servicios");
    }
  }

  async getServiceDetailView(req, res) {
    try {
      const { sid } = req.params;

      const service = await servicesService.getServiceById(sid);

      if (!service) {
        return res.status(404).send("Servicio no encontrado");
      }

      res.render("service-detail", { service });
    } catch (error) {
      res.status(500).send("Error al cargar el servicio");
    }
  }

  async getRealtimeServicesView(req, res) {
    try {
      const result = await servicesService.getServices();

      res.render("realtime-services", { services: result.services });
    } catch (error) {
      res.status(500).send("Error al cargar los servicios");
    }
  }

  async getBookingDetailView(req, res) {
    try {
      const { bid } = req.params;

      const booking = await bookingsService.getBookingById(bid);

      if (!booking) {
        return res.status(404).send("Reserva no encontrada");
      }

      res.render("booking-detail", { booking });
    } catch (error) {
      res.status(500).send("Error al cargar la reserva");
    }
  }

  async getBookingsView(req, res) {
    try {
      const bookings = await bookingsService.getBookings();

      res.render("bookings", { bookings });
    } catch (error) {
      res.status(500).send("Error al cargar las reservas");
    }
  }
}
