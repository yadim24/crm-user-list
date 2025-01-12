import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios, { isAxiosError } from 'axios';
import { FC, ReactNode } from 'react';
import { authTokenStore } from 'shared/authToken';
import { IS_DEV } from 'shared/constants';
import { store } from 'store/store';
import { openAlert } from 'store/toastSlice';
import { z } from 'zod';

const validateErrorDetailField = z.object({
  detail: z.string(),
});

type Props = {
  children: ReactNode;
};

const globalHandleError = (error: unknown): void => {
  // Обычно это ошибка приходит от apiAxios.interceptors.request
  // на строке controller.abort(), прерывания возникающие в react-query
  // обрабатываются им внутри себя и не пробрасываются в обработчик ошибок
  if (axios.isCancel(error)) {
    // В случае отсутствия Refresh-ключа нет сообщений и требует авторизоваться
    if (!authTokenStore.getRefreshToken()) return;

    store.dispatch(
      openAlert({
        message:
          'Запрос был прерван. Возможно, это связано с проблемами авторизации.',
        alertType: 'error',
      }),
    );

    return;
  }

  if (
    isAxiosError(error) &&
    error.code === 'ECONNABORTED' &&
    error.message.startsWith('timeout')
  ) {
    store.dispatch(
      openAlert({
        alertType: 'error',
        message: 'Превышено время ожидания ответа сервера.',
      }),
    );

    return;
  }

  // Обработка ошибок форм производится внутри компоненты с формой
  if (isAxiosError(error) && error.response?.status === 422) return;

  // Обработка ошибок аутентификации производится внутри компоненты Login
  if (isAxiosError(error) && error.response?.status === 403) return;

  if (isAxiosError(error) && error.response?.status === 500) {
    store.dispatch(
      openAlert({ message: 'Ошибка сервера', alertType: 'error' }),
    );

    return;
  }

  if (isAxiosError(error) && error.response?.status === 404) {
    const validatedErrorDetailField = validateErrorDetailField.safeParse(
      error.response.data,
    );

    store.dispatch(
      openAlert({
        message: validatedErrorDetailField.success
          ? validatedErrorDetailField.data.detail
          : 'Данные не найдены',
        alertType: 'error',
      }),
    );

    return;
  }

  if (isAxiosError(error) && error.response?.status) {
    store.dispatch(
      openAlert({
        message: `Произошла ошибка, статус: ${error.response.status}`,
        alertType: 'error',
      }),
    );

    return;
  }

  if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
    store.dispatch(
      openAlert({
        message: 'Ошибка сети, проверьте интернет-сооединение',
        alertType: 'error',
      }),
    );

    return;
  }

  if (error instanceof Error && error.message) {
    store.dispatch(
      openAlert({
        message: error.message || 'Обнаружены неизвестные ошибки.',
        alertType: 'error',
      }),
    );

    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('error-->', error);
    }
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: globalHandleError,
  }),
  mutationCache: new MutationCache({
    onError: globalHandleError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const QueryAppProvider: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
