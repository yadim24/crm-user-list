import { queryClient } from 'App/QueryAppProvider';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import { authTokenStore } from 'shared/authToken';
import { IS_DEV } from 'shared/constants';
import { AuthDTO } from './types/authorization';

export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 1 * 60 * 1000, // 1 мин
  // https://github.com/axios/axios/issues/5058#issuecomment-1272107602
  // indexes: null => https://path/to/api?foo=5&foo=2,
  // by default indexes: false => https://path/to/api?foo[]=5&foo[]=2
  paramsSerializer: {
    indexes: null,
  },
});

export const CREATE_REQUEST = '/auth/jwt/create/';
const REFRESH_REQUEST = '/auth/jwt/refresh/';
let isAccessTokenRefreshing = false;

type NewTokenWaitingQueue = {
  resolve: (value?: unknown) => void;
  reject: (value?: unknown) => void;
}[];

let newTokenWaitingQueue: NewTokenWaitingQueue = [];

const processNewTokenWaitingQueue = (error?: unknown): void => {
  newTokenWaitingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  newTokenWaitingQueue = [];
};

apiAxios.interceptors.request.use(async (config) => {
  const currentAccessToken = authTokenStore.getAccessToken();
  const currentRefreshToken = authTokenStore.getRefreshToken();

  const controller = new AbortController();
  controller.abort();

  if (!currentRefreshToken && !config.url?.includes(CREATE_REQUEST)) {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('Запрос отменен иинтерсептором');
    }

    return { ...config, signal: controller.signal };
  }

  if (!currentAccessToken && currentRefreshToken) {
    if (!isAccessTokenRefreshing) {
      isAccessTokenRefreshing = true;

      try {
        const { data } = (await apiAxios({
          url: REFRESH_REQUEST,
          method: 'POST',
          data: {
            refresh: authTokenStore.getRefreshToken(),
          },
        })) as AxiosResponse<AuthDTO>;

        authTokenStore.setAccessToken(data.access);
        authTokenStore.setRefreshToken(data.refresh);
        processNewTokenWaitingQueue();
      } catch (refreshingTokenError) {
        processNewTokenWaitingQueue(refreshingTokenError);
        authTokenStore.deleteRefreshToken();
        authTokenStore.deleteAccessToken();
        queryClient.resetQueries();

        return { ...config, signal: controller.signal };
      } finally {
        isAccessTokenRefreshing = false;
      }
    }

    if (isAccessTokenRefreshing && !config.url?.includes(REFRESH_REQUEST)) {
      await new Promise((resolve, reject) => {
        newTokenWaitingQueue.push({ resolve, reject });
      });
    }
  }

  const freshAccessToken = authTokenStore.getAccessToken();

  if (freshAccessToken) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${freshAccessToken}`,
    });
  }

  return config;
});

apiAxios.interceptors.response.use(undefined, async (error) => {
  if (isAxiosError(error)) {
    const { response, config: originalConfigRequest } = error;

    if (response?.status === 401) {
      if (!isAccessTokenRefreshing) {
        isAccessTokenRefreshing = true;

        try {
          const { data } = (await apiAxios({
            url: REFRESH_REQUEST,
            method: 'POST',
            data: {
              refresh: authTokenStore.getRefreshToken(),
            },
          })) as AxiosResponse<AuthDTO>;

          authTokenStore.setAccessToken(data.access);
          authTokenStore.setRefreshToken(data.refresh);
          processNewTokenWaitingQueue();
        } catch (refreshingTokenError) {
          processNewTokenWaitingQueue(refreshingTokenError);
          authTokenStore.deleteRefreshToken();
          authTokenStore.deleteAccessToken();
          queryClient.resetQueries();

          throw refreshingTokenError;
        } finally {
          isAccessTokenRefreshing = false;
        }

        return apiAxios(originalConfigRequest!);
      }

      if (!originalConfigRequest?.url?.includes(REFRESH_REQUEST)) {
        await new Promise((resolve, reject) => {
          newTokenWaitingQueue.push({ resolve, reject });
        });

        return apiAxios(originalConfigRequest!);
      }
    }
  }

  throw error;
});
