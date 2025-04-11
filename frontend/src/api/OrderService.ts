import { CreateOrderDto, CreateOrderResponse, GetOrdersMetricsResponse, Order, UpdateOrderDto } from "../pages/orders"
import { api, Response } from "./api";


class OrderService {
    async get(): Promise<Response<Order[]>> {
        const response = await api.get<Response<Order[]>>('/order');
        return response.data;
    }

    async create(createOrderDto: CreateOrderDto) {
        const response = await api.post<Response<CreateOrderResponse>>('/order', createOrderDto);
        return response.data;
    }

    async remove(id: string) {
        const response = await api.delete<Response<Order>>(`/order/${id}`);
        return response.data;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const response = await api.patch<Response<Order>>(`/order/${id}`, updateOrderDto);
        return response.data;
    }

    async getMetrics() {
        const response = await api.get<Response<GetOrdersMetricsResponse>>('/metrics');
        return response.data;
    }
}

export const orderService = new OrderService();