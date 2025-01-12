import '@fontsource-variable/inter';
import { createTheme, Theme } from '@mui/material';

export const createAppTheme = (): Theme => {
  const baseTheme = createTheme({
    typography: {
      fontFamily: 'Inter Variable, sans-serif',
    },
  });

  return createTheme({
    ...baseTheme,
    components: {
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiTableCell: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiFormControl: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: 'small',
        },
      },
    },
  });
};
