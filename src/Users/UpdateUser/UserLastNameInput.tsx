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

export const UserLastNameInput: FC<Props> = ({ control, fieldReset }) => {
  const lastNameValue = useWatch({ control, name: 'last_name' });

  return (
    <ControlledTextField
      name="last_name"
      control={control}
      textFieldProps={{
        label: 'Фамилия',
        required: true,
        fullWidth: true,
        sx: { my: 1 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              {lastNameValue ? (
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
      }}
    />
  );
};
