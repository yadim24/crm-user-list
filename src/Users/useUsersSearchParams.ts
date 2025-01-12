import { UserListQueryDTO } from 'api/types/users';
import { useCallback } from 'react';
import { NavigateOptions, useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from 'shared/decodeSearchParams';
import { z } from 'zod';

export const USERS_QUERY_PARAM = {
  ORDERING: 'ordering',
  SEARCH: 'search',
} satisfies Record<string, keyof UserListQueryDTO>;

const usersSearchParamsScheme = z.object({
  [USERS_QUERY_PARAM.ORDERING]: z.string().optional(),
  [USERS_QUERY_PARAM.SEARCH]: z.string().optional(),
});

type SetSearchParamsWrapper = (
  nextSearchParams: (prev: URLSearchParams) => URLSearchParams,
  navigateOpts?: NavigateOptions,
) => void;

export const useUsersSearchParams = (): [
  z.infer<typeof usersSearchParamsScheme>,
  SetSearchParamsWrapper,
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsWrapper = useCallback<SetSearchParamsWrapper>(
    (nextInit, ...restParams) => {
      setSearchParams(
        (prevSearchParams) => {
          const nextSearchParams = nextInit(prevSearchParams);

          return nextSearchParams;
        },
        { preventScrollReset: true, replace: true, ...restParams },
      );
    },
    [setSearchParams],
  );

  const validatedSearchParams = usersSearchParamsScheme.parse(
    decodeSearchParams(searchParams),
  );

  return [validatedSearchParams, setSearchParamsWrapper];
};
