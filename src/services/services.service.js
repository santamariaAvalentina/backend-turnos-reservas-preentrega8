import { ServicesRepository } from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

export class ServicesService {
  async getServices(filters = {}) {
    return await servicesRepository.getAll(filters);
  }

  async getServiceById(id) {
    return await servicesRepository.getById(id);
  }

  async createService(serviceData) {
    return await servicesRepository.create(serviceData);
  }

  async updateService(id, updatedData) {
    const service = await servicesRepository.getById(id);

    if (!service) {
      return null;
    }

    const { id: _, ...data } = updatedData;

    return await servicesRepository.update(id, data);
  }

  async deleteService(id) {
    const service = await servicesRepository.getById(id);

    if (!service) {
      return null;
    }

    return await servicesRepository.delete(id);
  }
}