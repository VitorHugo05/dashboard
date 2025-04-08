import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';

import OrdersPage from './pages/orders';
import DashboardPage from './pages/dashboard';
import ProductsPage from './pages/products';
import CategoriesPage from './pages/categories';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'orders',
            Component: OrdersPage
          },
          {
            path: 'products',
            Component: ProductsPage
          },
          {
            path: 'categories',
            Component: CategoriesPage
          }
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);