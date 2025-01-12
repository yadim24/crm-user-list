import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { FC } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { ControlledTextField } from 'shared/reactHookForm/ControlledTextField';
import { UserFormValue } from './typesAndSchemas';

type Props = {
  control: Control<UserFormValue>;
  fieldReset: () => void;
};

export const UserEmailInput: FC<Props> = ({ control, fieldReset }) => {
  const emailValue = useWatch({ control, name: 'email' });

  return (
    <ControlledTextField
      name="email"
      control={control}
      textFieldProps={{
        label: 'Email',
        required: true,
        fullWidth: true,
        sx: { mb: 1 },
        slotProps: {
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {emailValue ? (
                  <IconButton tabIndex={-1} onClick={fieldReset}>
                    <ClearOutlinedIcon color="action" />
                  </IconButton>
                ) : (
                  <Box
                    sx={{
                      width: 36,
                    }}
                  />
                )}
              </InputAdornment>
            ),
          },
        },
      }}
    />
  );
};
