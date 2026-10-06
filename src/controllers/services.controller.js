
import { ServicesService } from "../services/services.service.js";

const servicesService = new ServicesService();

export default class ServiceController {
  async getServices(req, res) {
    try {
      const result = await servicesService.getServices(req.query);

      res.json({
        status: "success",
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los servicios",
      });
    }
  }

  async getServiceById(req, res) {
    try {
      const { id } = req.params;

      const service = await servicesService.getServiceById(id);

      if (!service) {
        return res.status(404).json({
          error: "Servicio no encontrado",
        });
      }

      res.json(service);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el servicio",
      });
    }
  }

  async createService(req, res) {
    try {
      const newService = await servicesService.createService(req.body);

      const services = await servicesService.getServices({});

      req.app.io.emit("servicesUpdated", services);

      res.status(201).json(newService);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async updateService(req, res) {
    try {
      const { id } = req.params;

      if (!req.body) {
        return res.status(400).json({
          error: "El body es obligatorio",
        });
      }

      const updatedService = await servicesService.updateService(
        id,
        req.body
      );

      if (!updatedService) {
        return res.status(404).json({
          error: "Servicio no encontrado",
        });
      }

      res.json(updatedService);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;

      const deletedService = await servicesService.deleteService(id);

      if (!deletedService) {
        return res.status(404).json({
          error: "Servicio no encontrado",
        });
      }

      res.json({
        message: "Servicio eliminado exitosamente",
        service: deletedService,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al eliminar el servicio",
      });
    }
  }
}