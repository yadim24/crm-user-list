import { css, Global } from '@emotion/react';
import { useTheme } from '@mui/material';
import { FC } from 'react';

export const GlobalStyles: FC = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        /* Custom browser scrollbar -> */
        body::-webkit-scrollbar,
        body *::-webkit-scrollbar {
          background-color: ${theme.palette.background.paper};
        }

        body::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        body *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        body::-webkit-scrollbar-corner,
        body *::-webkit-scrollbar-corner {
          background-color: ${theme.palette.background.paper};
        }

        body::-webkit-scrollbar-thumb:focus,
        body *::-webkit-scrollbar-thumb:focus {
          background-color: ${theme.palette.primary.dark};
        }

        body::-webkit-scrollbar-thumb:active,
        body *::-webkit-scrollbar-thumb:active {
          background-color: ${theme.palette.primary.dark};
        }

        body::-webkit-scrollbar-thumb:hover,
        body *::-webkit-scrollbar-thumb:hover {
          background-color: ${theme.palette.primary.dark};
        }

        body::-webkit-scrollbar-thumb,
        body *::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: ${theme.palette.primary.main};
          min-height: 24px;
          border: 1px solid ${theme.palette.background.paper};
        }
        /* <- Custom browser scrollbar */
      `}
    />
  );
};
