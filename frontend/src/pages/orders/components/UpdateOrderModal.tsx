import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, InputLabel, FormControl, Select, Chip, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Order, UpdateOrderDto } from '../index';
import { Product } from '../../products';
import { DatePicker } from '@mui/x-date-pickers';
import { formatCents } from '../../products';

interface OrderFormValues {
    productIds: string[];
    date: Date;
}

interface UpdateOrderModalProps {
    open: boolean;
    onClose: () => void;
    products: Product[];
    order: Order;
    onSubmit: (_id: string, data: UpdateOrderDto) => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({ open, onClose, products, onSubmit, order }) => {
    const { handleSubmit, formState: { errors }, control, reset, watch } = useForm<OrderFormValues>({
        defaultValues: {
            productIds: order.productIds,
            date: new Date(order.date),
        }
    });

    const selectedProductIds = watch("productIds");

    const calculateTotal = () => {
        return selectedProductIds.reduce((total, productId) => {
            const product = products.find(p => p._id === productId);
            if (product) {
                return total + product.price;
            }
            return total;
        }, 0) / 100;
    };

    const handleFormSubmit = (data: OrderFormValues) => {
        onSubmit(order._id, {
            ...data,
            total: calculateTotal() * 100
        });
        onClose();
        reset();
    };

    const onCancel = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Criar Pedido</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Controller name="date" control={control} render={({ field }) => (
                        <DatePicker {...field} label="Data do Pedido" format="dd/MM/yyyy" />
                    )} />

                    <FormControl fullWidth error={!!errors.productIds}>
                        <InputLabel>Produtos</InputLabel>
                        <Controller name="productIds" control={control} rules={{ required: 'Selecione pelo menos um produto' }} render={({ field }) => (
                            <Select {...field} multiple onChange={(event) => field.onChange(event.target.value)} renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => {
                                        const product = products.find((p) => p._id === value);
                                        return product ? <Chip key={value} label={product.name} /> : null;
                                    })}
                                </Box>
                            )}>
                                {products.map((product) => (
                                    <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                                ))}
                            </Select>
                        )} />
                        {errors.productIds && <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: 0.5 }}>{errors.productIds.message}</Box>}
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <p>Total: {formatCents(calculateTotal())}</p>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} color="inherit" variant="outlined">Cancelar</Button>
                <Button onClick={handleSubmit(handleFormSubmit)} color="primary" variant="contained">Criar Pedido</Button>
            </DialogActions>
        </Dialog>
    );
};


export default UpdateOrderModal;