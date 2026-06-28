import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colorSchemes: {
    // dark: true,
  },
  palette: {
    background: {
      default: 'hsla(200, 80%, 80%, 10%)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'initial',
          textAlign: 'left',
          justifyContent: 'start',
          userSelect: 'text',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          color: '#333',
          backgroundColor: '#4444',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fafafa',
        },
      },
    },
  },
});

export const codeTheme = createTheme({
  typography: {
    htmlFontSize: 14,
    body1: { fontSize: '0.75rem' },
  },
});
