import { TableCellProps } from '@mui/material';
import { ReactNode } from 'react';
import { z } from 'zod';

export type OmitTyped<T, P extends keyof T> = Omit<T, P>;

export type ErrorDto<T extends Record<string, unknown>> = {
  response?: {
    data?: Partial<Record<keyof T, string[]>>;
  };
};

export type TableHeadCell = {
  id: string;
  label: ReactNode;
  isSortable?: boolean;
  align?: TableCellProps['align'];
  width?: string;
  padding?: string;
  tableCellPadding?: TableCellProps['padding'];
};

export const schemeErrorDTO = z.object({
  detail: z.array(
    z.object({
      loc: z.array(z.union([z.string(), z.number()])),
      msg: z.string(),
      type: z.string(),
    }),
  ),
});
