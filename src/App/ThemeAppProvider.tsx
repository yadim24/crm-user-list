import { CssBaseline, ThemeProvider } from '@mui/material';
import { FC, ReactNode } from 'react';
import { IS_DEV } from 'shared/constants';
import { GlobalStyles } from './GlobalStyles';
import { createAppTheme } from './theme';

const theme = createAppTheme();

type Props = {
  children: ReactNode;
};

export const ThemeAppProvider: FC<Props> = ({ children }) => {
  // eslint-disable-next-line no-console
  if (IS_DEV) console.log(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
