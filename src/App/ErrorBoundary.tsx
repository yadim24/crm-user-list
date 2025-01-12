import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { z } from 'zod';

const errorValidation = z.object({
  message: z.string(),
});

export const ErrorBoundary: FC = () => {
  const [isShownError, setIsShownError] = useState(false);
  const error = useRouteError();
  const validatedError = errorValidation.safeParse(error);

  const errorMessage = validatedError.success
    ? validatedError.data.message
    : null;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: '24px',
        }}
      >
        <Typography align="justify" sx={{ mb: '24px' }}>
          Попробуйте обновить страницу или вернуться на предыдущую.
        </Typography>
        {errorMessage && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => setIsShownError((prevState) => !prevState)}
            sx={{ mb: '8px' }}
          >
            Подробнее
          </Button>
        )}
        {isShownError && errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
      </Paper>
    </Box>
  );
};
