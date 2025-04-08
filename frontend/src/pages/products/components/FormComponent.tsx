import { Box, Grid2, Typography } from '@mui/material'
import * as React from 'react'

export default function FormComponent() {
    return (
        <Box>
            <Typography>
                Novo produto
            </Typography>
            <Grid2 container >
                <Grid2>primeiro</Grid2>
                <Grid2>segundo</Grid2>
            </Grid2>
        </Box>
    )
}