import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Grid2,
  Card,
  Typography
} from '@mui/material';
import { Product, productService } from '../../api/ProductService';
import TableComponent from './components/TableComponent';
import CardsComponent from './components/CardsComponent';
import FormComponent from './components/FormComponent';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.get();
        setProducts(response.data || []);
      } catch (error) {
        console.error("error fetching: ", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid2 container columns={3}>
      <CardsComponent products={products}/>
      <TableComponent products={products}/>
      <FormComponent />
    </Grid2>
  );
}