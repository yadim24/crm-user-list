import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { createRequest } from 'api/createRequest';
import {
  AddUserDTO,
  UpdateUserDTO,
  userDTO,
  UserDTO,
  userListDTO,
  UserListDTO,
  UserListQueryDTO,
} from 'api/types/users';
import { OmitTyped } from 'shared/typesAndSchemes';

export const userMeQueryKey = {
  root: ['userMe'],
};

export type UseUserMeQueryOptions = OmitTyped<
  UseQueryOptions<unknown, unknown, unknown, string[]>,
  'queryKey' | 'queryFn'
>;

export const useUserMe = (
  options?: UseUserMeQueryOptions,
): UseQueryResult<unknown, unknown> =>
  useQuery({
    queryKey: userMeQueryKey.root,
    queryFn: ({ signal }) =>
      createRequest({
        options: {
          url: `/users/me/`,
          method: 'GET',
          signal,
        },
      }),
    ...options,
  });

export const userListQueryKey = {
  root: ['userList'],
  params: (query: UserListQueryDTO) => [...userListQueryKey.root, query],
};

export type UseUserListQueryOptions = OmitTyped<
  UseQueryOptions<
    UserListDTO,
    unknown,
    UserListDTO,
    (string | UserListQueryDTO)[]
  >,
  'queryKey' | 'queryFn'
>;

export const useUserList = (
  query: UserListQueryDTO,
  options?: UseUserListQueryOptions,
): UseQueryResult<UserListDTO, unknown> =>
  useQuery({
    queryKey: userListQueryKey.params(query),
    queryFn: ({ signal }) =>
      createRequest({
        options: {
          url: '/users/',
          method: 'GET',
          params: query,
          signal,
        },
        schema: userListDTO,
      }),
    staleTime: 5 * 60 * 1000, // 5 минут
    ...options,
  });

export const userQueryKey = {
  root: ['user'],
  params: (userId: string) => [...userQueryKey.root, userId],
};

export type UseUserQueryOptions = OmitTyped<
  UseQueryOptions<UserDTO, unknown, UserDTO, string[]>,
  'queryKey' | 'queryFn'
>;

export const useUser = (
  params: { userId: string },
  options?: UseUserQueryOptions,
): UseQueryResult<UserDTO, unknown> =>
  useQuery({
    queryKey: userQueryKey.params(params.userId),
    queryFn: ({ signal }) =>
      createRequest({
        options: {
          url: `/users/${params.userId}/`,
          method: 'GET',
          signal,
        },
        schema: userDTO,
      }),
    staleTime: 5 * 60 * 1000, // 5 минут
    ...options,
  });

export type UseAddUserOptions = UseMutationOptions<
  UserDTO,
  unknown,
  AddUserDTO,
  unknown
>;

export const useAddUser = (
  options?: UseAddUserOptions,
): UseMutationResult<UserDTO, unknown, AddUserDTO, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createRequest({
        options: {
          url: '/users/',
          method: 'POST',
          data,
        },
        schema: userDTO,
      }),
    ...options,

    onSuccess: (...restParams) => {
      queryClient.invalidateQueries({ queryKey: userListQueryKey.root });

      options?.onSuccess?.(...restParams);
    },
  });
};

export type UseUpdateUserOptions = UseMutationOptions<
  UserDTO,
  unknown,
  { body: UpdateUserDTO; userId: number },
  unknown
>;

export const useUpdateUser = (
  options?: UseUpdateUserOptions,
): UseMutationResult<
  UserDTO,
  unknown,
  { body: UpdateUserDTO; userId: number },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createRequest({
        options: {
          url: `/users/${data.userId}/`,
          method: 'PATCH',
          data: data.body,
        },
        schema: userDTO,
      }),
    ...options,

    onSuccess: (responseData, variables, ...restParams) => {
      queryClient.invalidateQueries({ queryKey: userListQueryKey.root });
      queryClient.setQueryData(
        userQueryKey.params(variables.userId.toString()),
        responseData,
      );

      options?.onSuccess?.(responseData, variables, ...restParams);
    },
  });
};

export type UseDeleteUserOptions = UseMutationOptions<
  unknown,
  unknown,
  { userId: number },
  unknown
>;

export const useDeleteUser = (
  options?: UseDeleteUserOptions,
): UseMutationResult<unknown, unknown, { userId: number }, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }) =>
      createRequest({
        options: {
          url: `/users/${userId}/`,
          method: 'DELETE',
        },
      }),
    ...options,

    onSuccess: (...restParams) => {
      queryClient.invalidateQueries({ queryKey: userListQueryKey.root });

      options?.onSuccess?.(...restParams);
    },
  });
};
