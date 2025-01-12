import { Backdrop, Box, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

interface OverlayLoadingSpinnerProps
  extends React.ComponentPropsWithRef<'div'> {
  isLoading: boolean;
}

export const OverlayLoadingSpinner = forwardRef<
  HTMLDivElement,
  OverlayLoadingSpinnerProps
>(({ isLoading, children }, ref) => (
  <Box
    component="div"
    ref={ref}
    sx={{
      position: 'relative',
    }}
  >
    <Backdrop
      sx={{
        position: 'absolute',
        zIndex: (theme) => theme.zIndex.appBar - 1,
        bgcolor: 'rgba(255, 255, 255, 0.06)',
        userSelect: 'none',
      }}
      open={isLoading}
    >
      <CircularProgress />
    </Backdrop>
    {children}
  </Box>
));
