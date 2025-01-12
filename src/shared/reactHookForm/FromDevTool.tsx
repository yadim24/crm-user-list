import { DevTool } from '@hookform/devtools';
import { Control, FieldValues } from 'react-hook-form';
import { IS_DEV } from '../constants';

export const FormDevTool = <T extends FieldValues>({
  control,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any>;
}): JSX.Element | null => {
  if (IS_DEV) {
    return <DevTool control={control} placement="top-right" />;
  }

  return null;
};
