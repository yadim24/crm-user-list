import { AxiosRequestConfig } from 'axios';
import { IS_DEV } from 'shared/constants';
import { z } from 'zod';
import { apiAxios } from './apiAxios';

export type CreateRequestParams<Data, Schema extends z.ZodTypeAny> = {
  options: AxiosRequestConfig<Data>;
  schema?: Schema;
};

export const createRequest = async <Data, Schema extends z.ZodTypeAny>({
  options,
  schema,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
CreateRequestParams<Data, Schema>): Promise<any> => {
  const { data } = await apiAxios({
    ...options,
  });

  if (schema) {
    const schemaResult = schema.safeParse(data);
    const isInvalid = !schemaResult.success;

    if (IS_DEV && isInvalid) {
      // eslint-disable-next-line no-console
      console.log('Incorrect API types-->', schemaResult.error.issues);
      // eslint-disable-next-line no-console
      console.log('Incorrect API data-->', data);
    }

    if (isInvalid) {
      throw new Error('Сервер вернул неверный формат данных!');
    }
  }

  return data;
};
