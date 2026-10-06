import { ServicesDAO } from "../dao/services.dao.js";

const servicesDAO = new ServicesDAO();

export class ServicesRepository {

    async getAll(filters = {}) {
        return await servicesDAO.getAll(filters);
    }

    async getById(id) {
        return await servicesDAO.getById(id);
    }

    async create(service) {
        return await servicesDAO.create(service);
    }

    async update(id, service) {
        return await servicesDAO.update(id, service);
    }

    async delete(id) {
        return await servicesDAO.delete(id);
    }
}