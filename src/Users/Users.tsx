import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Box, Container, IconButton, Tooltip, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { UpdateUser } from './UpdateUser';
import { UserList } from './UserList';
import { UsersFilter } from './UsersFilter';

export const Users: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 2,
          marginRight: 2,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            ml: '42px',
          }}
        >
          Пользователи
        </Typography>
        <Tooltip title="Добавить пользователя">
          <IconButton onClick={() => setOpen(true)}>
            <PersonAddOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <UsersFilter />
      <UserList />
      <UpdateUser open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};
