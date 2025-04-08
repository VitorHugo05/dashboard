import * as React from 'react'
import { Box, Card, Typography } from "@mui/material";
import { Product } from "../../../api/ProductService";

interface Props {
    products: Product[]
}

export default function CardsComponent({products}: Props) {
    const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);

    return (
        <Box sx={{
            padding: 3,
            display: "flex",
            width: '100%',
            gap: 2
          }}>
            <Card 
              elevation={0} 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                backgroundColor: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Receita total
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalRevenue)}
              </Typography>
            </Card>
    
            <Card 
              elevation={0}
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                backgroundColor: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Total de produtos
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                {products.length}
              </Typography>
            </Card>
          </Box>
    )
}