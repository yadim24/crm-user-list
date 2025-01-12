import {
  Box,
  Button,
  Container,
  Grid2,
  Skeleton,
  Typography,
} from '@mui/material';
import { useUser } from 'api/endpoints/users';
import { FC, useState } from 'react';
import { useTypedRouteParams } from 'shared/hooks/useTypedParams';
import { invariant } from 'shared/utils/invariant';
import { UpdateUser } from './UpdateUser';

export const UserItem: FC = () => {
  const { userId } = useTypedRouteParams();
  invariant(!!userId, 'userId должен иметь тип string');
  const [open, setOpen] = useState(false);

  const userQuery = useUser({ userId });

  return userQuery.isPending ? (
    <Box>
      {Array.from({ length: 5 }, (_, index) => index + 1).map((item) => (
        <Skeleton key={item} height={40} />
      ))}
    </Box>
  ) : (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ textAlign: 'center', mb: 3 }}
      >
        {`${userQuery.data?.last_name} ${userQuery.data?.first_name} ${userQuery.data?.patronymic}`}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Grid2 container spacing={1} sx={{ width: '100%' }}>
          <Grid2 size={5} sx={{ textAlign: 'end' }}>
            ФИО:
          </Grid2>
          <Grid2 size={7}>
            {`${userQuery.data?.last_name} ${userQuery.data?.first_name} ${userQuery.data?.patronymic}`}
          </Grid2>
          <Grid2 size={5} sx={{ textAlign: 'end' }}>
            Компания:
          </Grid2>
          <Grid2 size={7}>{userQuery.data?.company}</Grid2>
          <Grid2 size={5} sx={{ textAlign: 'end' }}>
            Email:
          </Grid2>
          <Grid2 size={7}>{userQuery.data?.email}</Grid2>
          <Grid2 size={5} sx={{ textAlign: 'end' }}>
            Телефон:
          </Grid2>
          <Grid2 size={7}>{userQuery.data?.phone}</Grid2>
        </Grid2>
      </Box>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mr: 6 }}>
        Изменить
      </Button>
      <UpdateUser
        open={open}
        currentUser={userQuery.data}
        onClose={() => setOpen(false)}
      />
    </Container>
  );
};
