import FileDownloadDoneOutlinedIcon from '@mui/icons-material/FileDownloadDoneOutlined';
import {
  Alert,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material';
import { FC, ReactNode } from 'react';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { useAppSelector } from 'shared/hooks/useAppSelector';
import { closeAlert, selectToaster } from 'store/toastSlice';

type TransitionProps = Omit<SlideProps, 'direction'>;

const TransitionLeft = (props: TransitionProps): ReactNode => {
  return <Slide {...props} direction="left" />;
};

export const Toaster: FC = () => {
  const toaster = useAppSelector(selectToaster);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      key={toaster.alertType ?? 'empty'}
      open={toaster.open}
      autoHideDuration={toaster.alertType === 'error' ? 5000 : 1500}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      onClose={(_e, reason: SnackbarCloseReason) => {
        if (reason !== 'clickaway') dispatch(closeAlert());
      }}
      sx={{
        top: { xs: '80px' },
        maxWidth: { xs: '95%', sm: '60%', md: '30%' },
      }}
    >
      <Alert
        variant="standard"
        onClose={() => dispatch(closeAlert())}
        severity={toaster.alertType}
        {...(toaster.alertType === 'success' && {
          icon: <FileDownloadDoneOutlinedIcon />,
        })}
        sx={{ width: '100%' }}
      >
        {toaster.message}
      </Alert>
    </Snackbar>
  );
};
