import { Box, CircularProgress } from '@mui/material';
import { useUserMe } from 'api/endpoints/users';
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authTokenStore } from 'shared/authToken';

type PrivateRouteType = {
  children: ReactNode;
};

export const PrivateRoute: FC<PrivateRouteType> = ({ children }) => {
  const location = useLocation();
  const userMeQuery = useUserMe();

  if (userMeQuery.isPending)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );

  return authTokenStore.getAccessToken() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};
