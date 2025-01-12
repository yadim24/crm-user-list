import { AppRoutes } from 'AppRoutes/AppRoutes';
import { FC, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import { QueryAppProvider } from './QueryAppProvider';
import { ThemeAppProvider } from './ThemeAppProvider';
import { Toaster } from './Toaster';

export const App: FC = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <QueryAppProvider>
          <ThemeAppProvider>
            <AppRoutes />
            <Toaster />
          </ThemeAppProvider>
        </QueryAppProvider>
      </Provider>
    </StrictMode>
  );
};
