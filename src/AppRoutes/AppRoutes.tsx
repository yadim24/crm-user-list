import { ErrorBoundary } from 'App/ErrorBoundary';
import { Login } from 'Login';
import { ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom';
import { ROUTE_PARAM } from 'shared/constants';
import { Users } from 'Users';
import { UserItem } from 'Users/UserItem';
import { PageNotFound } from './PageNotFound';
import { PrivateRoute } from './PrivateRoutes';
import { SuspenseLoadingSpinner } from './SuspenseLoadingSpinner';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseLoadingSpinner>
        <Login />
      </SuspenseLoadingSpinner>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Outlet />
        <ScrollRestoration />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Navigate to="/users" />,
        index: true,
      },
      {
        path: 'users',
        element: (
          <SuspenseLoadingSpinner>
            <Users />
          </SuspenseLoadingSpinner>
        ),
      },
      {
        path: `users/:${ROUTE_PARAM.USER_ID}`,
        element: (
          <SuspenseLoadingSpinner>
            <UserItem />
          </SuspenseLoadingSpinner>
        ),
      },
      {
        path: '*',
        element: (
          <PrivateRoute>
            <PageNotFound />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export const AppRoutes = (): ReactNode => {
  return <RouterProvider router={router} />;
};
