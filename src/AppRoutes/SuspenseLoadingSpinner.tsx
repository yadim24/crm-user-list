import { Box } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import { OverlayLoadingSpinner } from 'shared/components/OverLayLoadingSpinner';

type Props = {
  children: ReactNode;
};

export const SuspenseLoadingSpinner: FC<Props> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <OverlayLoadingSpinner isLoading>
          <Box
            component="div"
            sx={{
              height: '100vh',
            }}
          />
        </OverlayLoadingSpinner>
      }
    >
      {children}
    </Suspense>
  );
};
