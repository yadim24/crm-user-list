import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { keepPreviousData } from '@tanstack/react-query';
import { useDeleteUser, useUserList } from 'api/endpoints/users';
import { UserDTO } from 'api/types/users';
import { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { handleError422 } from 'shared/handleError422';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { schemeErrorDTO, TableHeadCell } from 'shared/typesAndSchemes';
import { openAlert } from 'store/toastSlice';
import { UpdateUser } from './UpdateUser';
import { useUsersSearchParams } from './useUsersSearchParams';

const headCells: TableHeadCell[] = [
  { id: 'number', label: '' },
  { id: 'name', label: 'ФИО', isSortable: false },
  { id: 'company', label: 'КОМПАНИЯ', isSortable: true },
  { id: 'email', label: 'ЭЛ.ПОЧТА', isSortable: true },
  { id: 'phone', label: 'ТЕЛЕФОН', isSortable: true },
  { id: 'actions', label: '', width: '1px' },
];

export const UserList: FC = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDTO>();
  const [usersSearchParams] = useUsersSearchParams();
  const userListQuery = useUserList(usersSearchParams, {
    placeholderData: keepPreviousData,
  });

  const dispatch = useAppDispatch();
  const deleteUserMutation = useDeleteUser({
    onError: (error) =>
      handleError422({
        dispatch,
        callback: (response) => {
          const validatedError = schemeErrorDTO.safeParse(response.data);

          let isErrorHandled = false;

          if (validatedError.success && validatedError.data.detail[0]) {
            dispatch(
              openAlert({
                message:
                  validatedError.data.detail[0].msg ?? 'Произошла ошибка',
                alertType: 'error',
              }),
            );

            isErrorHandled = true;
          }

          return isErrorHandled;
        },
      })(error),
  });

  return userListQuery.isPending ? (
    <Box>
      {Array.from({ length: 5 }, (_, index) => index + 1).map((item) => (
        <Skeleton key={item} height={40} />
      ))}
    </Box>
  ) : (
    <TableContainer component={Paper} sx={{ boxShadow: shadows[2] }}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                id={headCell.id}
                align={headCell.align}
                width={headCell.width}
                sx={{ whiteSpace: 'nowrap', backgroundColor: 'lightblue' }}
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {userListQuery.data?.map((user, i) => (
            <TableRow
              key={user.id}
              hover
              sx={{ '&:last-child td': { border: 0 } }}
            >
              <TableCell>{i + 1}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Link
                  component={RouterLink}
                  to={`${user.id}`}
                  underline="hover"
                  sx={{ color: 'inherit' }}
                >{`${user.last_name} ${user.first_name} ${user.patronymic}`}</Link>
              </TableCell>
              <TableCell>{user.company}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Stack direction="row">
                  <Tooltip title="Редактировать">
                    <IconButton
                      onClick={() => {
                        setCurrentUser(user);
                        setOpen(true);
                      }}
                    >
                      <EditOutlinedIcon color="info" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      onClick={() =>
                        deleteUserMutation.mutate({ userId: user.id })
                      }
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateUser
        open={open}
        currentUser={currentUser}
        onClose={() => setOpen(false)}
      />
    </TableContainer>
  );
};
