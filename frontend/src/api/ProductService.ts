import { CreateProductDto, Product } from "../pages/products";
import { api, Response } from "./api";

class ProductService {

    async get(): Promise<Response<Product[]>> {
        const response = await api.get<Response<Product[]>>('/products');
        return response.data;
    }

    async create(createProductDto: CreateProductDto, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('createProductDto', JSON.stringify(createProductDto));

        const response = await api.post<Response<Product>>('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async remove(id: string) {
        const response = await api.delete<Response<Product>>(`/products/${id}`);
        return response.data;
    }

    async update(id: string, updateProductDto: CreateProductDto, file?: File) {
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('updateProductDto', JSON.stringify(updateProductDto));

        const response = await api.patch<Response<Product>>(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }


}

export const productService = new ProductService();