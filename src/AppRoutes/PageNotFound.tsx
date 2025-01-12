import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { FC } from 'react';

export const PageNotFound: FC = () => {
  const matchesMinWidth = useMediaQuery('(min-width: 500px)');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: matchesMinWidth ? 'row' : 'column',
        }}
      >
        <Typography
          variant="h4"
          component="p"
          sx={{
            textAlign: 'center',
          }}
        >
          404
        </Typography>
        {matchesMinWidth ? (
          <Divider orientation="vertical" flexItem sx={{ mx: 5 }} />
        ) : (
          <Divider orientation="horizontal" flexItem sx={{ my: 3 }} />
        )}
        <Typography
          variant="h6"
          component="p"
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Страница не найдена
        </Typography>
      </Box>
    </Box>
  );
};
