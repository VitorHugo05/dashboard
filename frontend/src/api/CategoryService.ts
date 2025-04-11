import { Category } from "../pages/categories";
import { api, Response } from "./api";

class CategoryService {
    async get() {
        const response = await api.get<Response<Category[]>>('/categories');
        return response.data;
    }

    async create(name: string) {
        const response = await api.post<Response<Category>>('/categories', {
            name
        });
        return response.data;
    }

    async remove(id: string) {
        const response = await api.delete<Response<Category>>(`/categories/${id}`);
        return response.data;
    }

    async update(id: string, name: string) {
        const response = await api.patch<Response<Category>>(`/categories/${id}`, {
            name
        });
        return response.data;
    }
}

export const categoryService = new CategoryService();