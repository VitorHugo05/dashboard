import { api, Response } from './api'

interface GetProduct {
    products: Product[]
}

interface CreateProduct {
    name: string;
    description: string;
    price: number;
    categoryIds: string[];
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    categoryIds: string[];
    imageUrl: string;
}

class ProductService {
    async get(): Promise<Response<GetProduct>> {
        const response = await api.get<Response<GetProduct>>('/products')
        return response.data;
    }

    async create(createProduct: CreateProduct, file: File) {
        const formData = new FormData()
        formData.append('data', JSON.stringify(createProduct))
        formData.append('file', file)
        const response = await api.post<Response<Product>>('/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }

    async update(id: string, updateProduct: Partial<CreateProduct>, file: File) {
        const formData = new FormData()
        formData.append('data', JSON.stringify(updateProduct))
        if(file) formData.append('file', file)
        const response = await api.put<Response<Product>>(`/product/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async delete(id: string) {
        const  response = await api.delete<Response<Product>>(`/products/${id}`)
        return response.data;
    }
}

export const productService = new ProductService();