import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDebounce } from 'shared/hooks/useDebounce';
import {
  USERS_QUERY_PARAM,
  useUsersSearchParams,
} from './useUsersSearchParams';

export const UsersFilter: FC = () => {
  const [usersSearchParams, setUsersSearchParams] = useUsersSearchParams();
  const search = usersSearchParams[USERS_QUERY_PARAM.SEARCH] ?? '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearchInput = useDebounce(searchInput, 600);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (search !== debouncedSearchInput) {
      setUsersSearchParams((prevUsersSearchParams) => {
        if (debouncedSearchInput) {
          prevUsersSearchParams.set(
            USERS_QUERY_PARAM.SEARCH,
            debouncedSearchInput,
          );
        } else {
          prevUsersSearchParams.delete(USERS_QUERY_PARAM.SEARCH);
        }

        return prevUsersSearchParams;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput]);

  return (
    <TextField
      label="Поиск по компании"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      sx={{ mx: 'auto', mb: 2 }}
      slotProps={{
        input: {
          style: { paddingRight: 0 },
          endAdornment: (
            <InputAdornment position="end">
              {searchInput ? (
                <IconButton onClick={() => setSearchInput('')}>
                  <ClearOutlinedIcon />
                </IconButton>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                  }}
                >
                  <SearchIcon />
                </Box>
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
