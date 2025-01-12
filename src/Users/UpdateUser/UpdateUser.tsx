import { Dialog, DialogTitle, ModalProps } from '@mui/material';
import { UserDTO } from 'api/types/users';
import { FC } from 'react';
import { UpdateUserContent } from './UpdateUserContent';

type Props = {
  open: boolean;
  currentUser?: UserDTO;
  onClose: () => void;
};

export const UpdateUser: FC<Props> = ({ open, currentUser, onClose }) => {
  const handleOnClose: ModalProps['onClose'] = (_e, reason) => {
    if (reason === 'backdropClick') return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      scroll="body"
      disableRestoreFocus
      onClose={handleOnClose}
      PaperProps={{
        sx: {
          '&&': {
            maxWidth: '440px',
            m: { xs: 2, sm: 4 },
          },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
        Данные пользователя
      </DialogTitle>
      <UpdateUserContent currentUser={currentUser} onClose={onClose} />
    </Dialog>
  );
};
