import { ServiceModel } from "./models/service.model.js";

export class ServicesDAO {

    async getAll({ category, available, page, limit, sortBy, order } = {}) {

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (available !== undefined) {
            filter.available = available === "true";
        }

        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 10;

        const skip = (currentPage - 1) * currentLimit;

        let sortOption = {};

        if (sortBy) {
            sortOption[sortBy] = order === "desc" ? -1 : 1;
        }

        const total = await ServiceModel.countDocuments(filter);

        const services = await ServiceModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(currentLimit)
            .lean();

        const totalPages = Math.ceil(total / currentLimit);

        return {
            services,
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages,
            hasPrevPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
        };
    }

    async getById(id) {
        return await ServiceModel.findById(id).lean();
    }

    async create(service) {
        const newService = await ServiceModel.create(service);
        return newService;
    }

    async update(id, updatedService) {
        return await ServiceModel.findByIdAndUpdate(
            id,
            updatedService,
            { new: true }
        );
    }

    async delete(id) {
        return await ServiceModel.findByIdAndDelete(id);
    }
}