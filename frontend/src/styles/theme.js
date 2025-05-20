import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { 
      main: '#00509e',
      light: '#cce3fa',
      dark: '#003366'
    },
    secondary: { 
      main: '#388e3c',
      light: '#e8f5e9' 
    },
    error: {
      main: '#d32f2f'
    },
    background: { 
      default: '#e3f0ff',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: { 
      fontWeight: 700, 
      fontSize: '2.25rem',
      letterSpacing: 2,
      lineHeight: 1.2
    },
    h2: { 
      fontWeight: 700, 
      fontSize: '1.75rem',
      letterSpacing: 1 
    },
    h3: { 
      fontWeight: 700, 
      fontSize: '1.375rem'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  }
});
