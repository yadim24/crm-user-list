import { TextField, type TextFieldProps } from '@mui/material';
import get from 'lodash/get';
import type { PropsWithChildren, ReactElement } from 'react';
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

type Props<FormValues extends FieldValues> = UseControllerProps<FormValues> & {
  textFieldProps?: Omit<
    TextFieldProps,
    'value' | 'onChange' | 'error' | 'inputRef'
  >;
};

export const ControlledTextField = <FormValues extends FieldValues>({
  textFieldProps,
  children,
  ...controllerProps
}: PropsWithChildren<Props<FormValues>>): ReactElement | null => {
  const {
    field: { onChange, name, value, ref },
    formState: { errors },
  } = useController<FormValues>(controllerProps);

  const errorMessage = get(errors, `${name}.message`);
  const helperText =
    typeof errorMessage === 'string' ? errorMessage : undefined;

  return (
    <TextField
      {...textFieldProps}
      value={value}
      onChange={onChange}
      error={!!helperText}
      helperText={helperText || textFieldProps?.helperText || ' '}
      inputRef={ref}
    >
      {children}
    </TextField>
  );
};
