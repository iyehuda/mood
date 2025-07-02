import { createTheme } from '@mui/material/styles';

// Create a Spotify-inspired theme while retaining the project's mood colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f15156',  // Coral-like color from the image
    },
    secondary: {
      main: '#1DB954',  // Spotify green for subtle accents
    },
    background: {
      default: '#121212',  // Spotify dark background
      paper: '#181818',    // Spotify card background
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: [
      'Gotham',
      'Circular',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500,
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.875rem',
          transition: 'transform 0.1s ease-in-out, background-color 0.3s ease',
          '&:hover': {
            transform: 'scale(1.04)',
          },
          '&:active': {
            transform: 'scale(0.96)',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            backgroundColor: '#282828',
            transform: 'translateY(-4px)',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 500,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f15156',
            },
          },
        },
      },
    },
  },
});

export default theme;
