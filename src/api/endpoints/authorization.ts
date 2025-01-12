import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import { CREATE_REQUEST } from 'api/apiAxios';
import { createRequest } from 'api/createRequest';
import { AuthDTO, LoginDTO, authDTO } from 'api/types/authorization';

type UseAuthorizationOptions = UseMutationOptions<AuthDTO, unknown, LoginDTO>;

export const useLogin = (
  options?: UseAuthorizationOptions,
): UseMutationResult<AuthDTO, unknown, LoginDTO, unknown> =>
  useMutation<AuthDTO, unknown, LoginDTO>({
    mutationFn: (data) =>
      createRequest({
        options: {
          url: CREATE_REQUEST,
          method: 'POST',
          data,
        },
        schema: authDTO,
      }),
    ...options,
  });
