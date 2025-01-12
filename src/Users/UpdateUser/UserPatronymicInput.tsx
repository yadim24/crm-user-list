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

export const UserPatronymicInput: FC<Props> = ({ control, fieldReset }) => {
  const patronymicValue = useWatch({ control, name: 'patronymic' });

  return (
    <ControlledTextField
      name="patronymic"
      control={control}
      textFieldProps={{
        label: 'Отчество',
        required: true,
        fullWidth: true,
        sx: { mb: 1 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              {patronymicValue ? (
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
