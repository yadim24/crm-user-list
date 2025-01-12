import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { useLogin } from 'api/endpoints/authorization';
import { isAxiosError } from 'axios';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { authTokenStore } from 'shared/authToken';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { ControlledTextField } from 'shared/reactHookForm/ControlledTextField';
import { openAlert } from 'store/toastSlice';
import { z } from 'zod';

const validateAuth = z.object({
  name: z.string().min(1, 'Это поле не может быть пустым'),
  password: z.string().min(1, 'Это поле не может быть пустым'),
});

export type AuthFormValues = z.infer<typeof validateAuth>;

export const Login: FC = () => {
  const dispatch = useAppDispatch();

  const { control, handleSubmit } = useForm<AuthFormValues>({
    resolver: zodResolver(validateAuth),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const loginMutation = useLogin({
    onError: (error) => {
      if (
        isAxiosError(error) &&
        error?.response?.status === 422 &&
        error.response.data.detail
      ) {
        dispatch(
          openAlert({
            message: error.response.data.detail,
            alertType: 'error',
          }),
        );
      }
    },
  });

  const onSubmit: SubmitHandler<AuthFormValues> = (formValues) => {
    loginMutation.mutate(formValues, {
      onSuccess: (data) => {
        authTokenStore.setAccessToken(data.access);
        authTokenStore.setRefreshToken(data.refresh);
      },
    });
  };

  return (
    <>
      {authTokenStore.getAccessToken() && <Navigate to="/users" replace />}
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box sx={{ width: '400px', mt: -40, p: 4, boxShadow: shadows[3] }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'fontWeightMedium',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Авторизация
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
              <ControlledTextField
                name="name"
                control={control}
                textFieldProps={{
                  required: true,
                  variant: 'outlined',
                  label: 'Логин',
                  type: 'text',
                  fullWidth: true,
                  size: 'medium',
                }}
              />
              <ControlledTextField
                name="password"
                control={control}
                textFieldProps={{
                  required: true,
                  variant: 'outlined',
                  label: 'Пароль',
                  type: 'password',
                  fullWidth: true,
                  size: 'medium',
                }}
              />
              <Button type="submit" variant="contained" size="large">
                Войти
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </>
  );
};
