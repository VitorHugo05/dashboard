import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Fade, Snackbar, Tooltip, Typography } from '@mui/material';
import { Button } from '../../stories/Button';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { orderService } from '../../api/OrderService';
import CreateOrderModal from './components/CreateOrderModal';
import { productService } from '../../api/ProductService';
import { Product } from '../products';
import UpdateOrderModal from './components/UpdateOrderModal';
import { formatCents } from '../products';
import { DataGrid } from '../../stories/DataGrid';

export interface Order {
    _id: string;
    date: Date;
    productIds: string[]
    total: number;
    createdAt: Date;
}

export interface UpdateOrderDto {
    productIds: string[]
    date: Date
    total: number
}

export interface GetOrdersMetricsResponse {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByPeriod: OrdersByPeriod;
}

export interface OrdersByPeriod {
    daily: Daily;
    weekly: Weekly;
    monthly: Monthly;
}

export interface Daily {
    [date: string]: number;
}

export interface Weekly {
    [week: string]: number;
}

export interface Monthly {
    [month: string]: number;
}



export interface GetOrdersDto {
    page: number;
    limit: number;
    search?: string;
}

export interface CreateOrderDto {
    productIds: string[]
    date: Date
    total: number
}

export interface CreateOrderResponse {
    _id: string;
    productIds: string[]
    date: Date
    total: number
    createdAt: Date;
    updatedAt: Date;
}

export interface GetOrdersResponse {
    orders: Order[];
}

const Cell = ({ value }: { value: any }) => {
    return (
        <Tooltip title={value} arrow>
            <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
                <Typography noWrap>{value}</Typography>
            </Box>
        </Tooltip>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);
    const [openCreateOrderModal, setOpenCreateOrderModal] = useState(false);
    const [openUpdateOrderModal, setOpenUpdateOrderModal] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);

    const [state, setState] = useState<{
        open: boolean;
        Transition: React.ComponentType<
            TransitionProps & {
                children: React.ReactElement<any, any>;
            }
        >;
        message: string;
    }>({
        open: false,
        Transition: Fade,
        message: '',
    });

    const onRemoveOrder = async (_id: string) => {
        try {
            const { data, statusCode } = await orderService.remove(_id);

            if (data && statusCode === 200) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Pedido deletado com sucesso',
                });
                setOrders(orders.filter((order) => order._id !== _id));
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao deletar pedido",
            });
        }
    };

    const handleChangeCreateOrderModal = () => {
        setOpenCreateOrderModal(!openCreateOrderModal);
    };

    const handleChangeUpdateCategoryModal = () => {
        if (orderToUpdate) {
            setOrderToUpdate(null);
        }
        setOpenUpdateOrderModal(!openUpdateOrderModal);
    };

    const getOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.get();

            if (response && response.data !== undefined) {
                setOrders(response.data);
            } else {
                console.error("Invalid data received from API:", response.data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };
    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.get();

            if (response && response.data !== undefined) {
                setProducts(response.data);
            } else {
                console.error("Invalid data received from API:", response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.all([getOrders(), getProducts()]);
    }, []);

    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const onCreateOrder = async (order: CreateOrderDto) => {
        try {
            const { data, statusCode } = await orderService.create(order);

            if (data && statusCode === 201) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Pedido criado com sucesso',
                });
                setOpenCreateOrderModal(false);
                setOrders([...orders, data]);
            }
        } catch (error) {
            console.error("Error creating pedido:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao criar pedido",
            });
        }
    };

    const onUpdateOrder = async (_id: string, updateOrderDto: UpdateOrderDto) => {
        try {
            const { data, statusCode } = await orderService.update(_id, updateOrderDto);

            if (data && statusCode === 200) {
                setState({
                    open: true,
                    Transition: Fade,
                    message: 'Pedido atualizado com sucesso',
                });
                setOpenCreateOrderModal(false);
                setOrders(orders.map((order) => (order._id === _id ? data : order)));
            }
        } catch (error) {
            console.error("Error updating pedido:", error);
            setState({
                open: true,
                Transition: Fade,
                message: "Erro ao atualizar pedido",
            });
        }
    };

    const columns: GridColDef[] = [
        {
            field: '_id',
            headerName: 'ID',
            width: 250,
            renderCell: (params) => <Cell value={params.value} />,
        },
        {
            field: 'total',
            headerName: 'Preço total',
            width: 200,
            renderCell: (params) => (
                <Cell value={formatCents(params.value)} />
            ),
        },
        {
            field: 'date',
            headerName: 'Criado em',
            width: 200,
            renderCell: (params) => (
                <Cell value={format(params.value, 'dd/MM/yyyy')} />
            )
        },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 250,
            renderCell: (params) => (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    width={'100%'}
                    height={'100%'}
                >
                    <Button
                        label="Editar"
                        color="primary"
                        size="small"
                        onClick={() => {
                            const orderId = params.row._id;
                            const order = orders.find((p) => p._id.toString() === orderId.toString());
                            if (order) {
                                setOrderToUpdate(order);
                                handleChangeUpdateCategoryModal();
                            }
                        }}
                        sx={{ marginRight: 1 }}
                        startIcon={<EditIcon />}
                    />

                    <Button
                        label="Remover"
                        color="error"
                        size="small"
                        onClick={() => {
                            const orderId = params.row._id;
                            const isConfirmed = window.confirm('Você tem certeza que deseja remover esse pedido?');
                            if (isConfirmed) {
                                onRemoveOrder(orderId);
                            }
                        }}
                        startIcon={<DeleteIcon />}
                    />
                </Box>
            ),
        }
    ];

    return (
        <div>
            <Box display={'flex'} justifyContent={'end'} mb={2}>
                <Button
                    variant="contained"
                    label="Adicionar pedido"
                    onClick={handleChangeCreateOrderModal}
                    loading={loading}
                />
            </Box>

            <DataGrid
                rows={orders}
                getRowId={(row) => row._id}
                columns={columns}
                pagination={true}
                rowCount={orders.length}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[5, 10]}
                loading={loading}
                checkboxSelection
                sx={{ border: 0 }}
            />

            <CreateOrderModal
                open={openCreateOrderModal}
                onClose={handleChangeCreateOrderModal}
                onSubmit={onCreateOrder}
                products={products}
            />

            {orderToUpdate && (
                <UpdateOrderModal
                    open={openUpdateOrderModal}
                    onClose={handleChangeUpdateCategoryModal}
                    onSubmit={onUpdateOrder}
                    order={orderToUpdate}
                    products={products}
                />
            )}
            <Snackbar
                open={state.open}
                TransitionComponent={state.Transition}
                message={state.message}
                key={state.Transition.name}
                autoHideDuration={100}
            />
        </div>
    );
}
