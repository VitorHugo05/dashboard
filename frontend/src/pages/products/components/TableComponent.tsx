import * as React from 'react';
import { 
  Box, 
  Chip, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Tooltip,
  IconButton 
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from "../../../api/ProductService";
import ViewProductModal from './ViewProductModal';

interface Props {
    products: Product[]
}

export default function TableComponent({products}: Props) {
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <TableContainer
                component={Paper}
                sx={{
                    minWidth: '80%',
                    margin: '0 auto'
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">Nome do Produto</TableCell>
                            <TableCell width="40%">Descrição</TableCell>
                            <TableCell width="15%" align="right">Preço</TableCell>
                            <TableCell width="20%" align="center">Categorias</TableCell>
                            <TableCell width="10%" align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(row.price)}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip
                                        title={
                                            <Box sx={{ p: 1 }}>
                                                {row.categoryIds.map((categoryId, index) => (
                                                    <Chip
                                                        key={categoryId}
                                                        label={`${categoryId}`}
                                                        sx={{
                                                            m: 0.5,
                                                            backgroundColor: 'white',
                                                            color: 'primary.main'
                                                        }}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        }
                                        arrow
                                    >
                                        <Chip
                                            label={`${row.categoryIds.length} categorias`}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'primary.main',
                                                    color: 'white'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleOpenModal(row)}
                                        color="primary"
                                        size="small"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedProduct && (
                <ViewProductModal
                    open={!!selectedProduct}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </Box>
    );
}