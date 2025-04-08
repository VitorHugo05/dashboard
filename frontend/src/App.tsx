import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import { Category, Inventory } from '@mui/icons-material';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Pedidos',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'products',
    title: 'Produtos',
    icon: <Inventory />,
  },
  {
    segment: 'categories',
    title: 'Categorias',
    icon: <Category />,
  },
];

const BRANDING = {
  title: "Dashboard",
  logo: <QueryStatsIcon sx={{fontSize: 40, color: "#42a5f5"}} />
};


export default function App() {
  
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}