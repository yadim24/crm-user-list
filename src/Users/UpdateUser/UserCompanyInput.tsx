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

export const UserCompanyInput: FC<Props> = ({ control, fieldReset }) => {
  const companyValue = useWatch({ control, name: 'company' });

  return (
    <ControlledTextField
      name="company"
      control={control}
      textFieldProps={{
        label: 'Компания',
        required: true,
        fullWidth: true,
        sx: { mb: 1 },
        slotProps: {
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {companyValue ? (
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
