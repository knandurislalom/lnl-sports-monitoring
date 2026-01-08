import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      50: '#E8EEF7',
      100: '#C5D5EA',
      200: '#9EB9DD',
      300: '#779DCF',
      400: '#5A88C5',
      500: '#013369',          // NFL Shield Blue
      600: '#012E5F',
      700: '#012754',
      800: '#01204A',
      900: '#001438',
      main: '#013369',         // NFL Shield Blue
      light: '#5A88C5',
      dark: '#012754',
      contrastText: '#FFFFFF',
    },
    secondary: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#D50A0A',          // NFL Red
      600: '#C40909',
      700: '#B30808',
      800: '#A20707',
      900: '#910606',
      main: '#D50A0A',         // NFL Red
      light: '#EF5350',
      dark: '#A20707',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#991B1B',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#92400E',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#013369',         // NFL Blue for info
      light: '#5A88C5',
      dark: '#012754',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669',
      light: '#10B981',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA',      // Light gray - main background
      paper: '#FFFFFF',        // White - card backgrounds
    },
    text: {
      primary: '#1F2937',      // Dark gray - main text
      secondary: '#6B7280',    // Medium gray - secondary text
      disabled: '#9CA3AF',     // Light gray - disabled text
    },
    divider: 'rgba(107, 114, 128, 0.2)',
    // Custom colors for status
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#A5ACAF',          // NFL Silver
      600: '#949A9D',
      700: '#6B7280',
      800: '#4B5563',
      900: '#374151',
    },
  },
  
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '2.5rem',      // 40px
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '2rem',        // 32px
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.5rem',      // 24px
      lineHeight: 1.3,
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.25rem',     // 20px
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.125rem',    // 18px
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',        // 16px
      lineHeight: 1.5,
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',        // 16px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',    // 14px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',    // 14px
      lineHeight: 1.5,
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',     // 12px
      lineHeight: 1.4,
      fontWeight: 400,
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',     // 12px
      lineHeight: 1.4,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  
  spacing: 8, // Base unit: 8px
  
  shape: {
    borderRadius: 8,
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',                    // Subtle lift
    '0px 4px 8px rgba(0, 0, 0, 0.12)',                   // Card elevation
    '0px 8px 16px rgba(0, 0, 0, 0.15)',                  // Elevated cards
    '0px 12px 24px rgba(0, 0, 0, 0.18)',                 // Modal, dropdown
    '0px 16px 32px rgba(0, 0, 0, 0.2)',                  // Prominent elements
    '0px 8px 16px rgba(1, 51, 105, 0.2)',                // NFL blue glow
    '0px 8px 16px rgba(213, 10, 10, 0.2)',               // NFL red glow
    '0px 4px 12px rgba(165, 172, 175, 0.15)',            // NFL silver subtle
    '0px 8px 16px rgba(16, 185, 129, 0.15)',             // Success glow
    '0px 8px 16px rgba(239, 68, 68, 0.15)',              // Error glow
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.15)',
    '0px 12px 24px rgba(0, 0, 0, 0.18)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 20px 40px rgba(0, 0, 0, 0.22)',
    '0px 24px 48px rgba(0, 0, 0, 0.25)',
    '0px 28px 56px rgba(0, 0, 0, 0.28)',
    '0px 32px 64px rgba(0, 0, 0, 0.3)',
    '0px 36px 72px rgba(0, 0, 0, 0.32)',
    '0px 40px 80px rgba(0, 0, 0, 0.35)',
    '0px 44px 88px rgba(0, 0, 0, 0.38)',
    '0px 48px 96px rgba(0, 0, 0, 0.4)',
    '0px 52px 104px rgba(0, 0, 0, 0.42)',
  ],
  
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
          backgroundImage: 'linear-gradient(180deg, #FAFAFA 0%, #F3F4F6 100%)',
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F3F4F6',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#9CA3AF',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#6B7280',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #013369 0%, #012754 100%)',
          boxShadow: '0px 4px 12px rgba(1, 51, 105, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #01396F 0%, #012E5F 100%)',
            boxShadow: '0px 6px 16px rgba(1, 51, 105, 0.25)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #D50A0A 0%, #A20707 100%)',
          boxShadow: '0px 4px 12px rgba(213, 10, 10, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #EF5350 0%, #D50A0A 100%)',
            boxShadow: '0px 6px 16px rgba(213, 10, 10, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#D50A0A',
          color: '#D50A0A',
          borderWidth: '2px',
          padding: '10px 22px',
          '&:hover': {
            backgroundColor: 'rgba(213, 10, 10, 0.08)',
            borderColor: '#EF5350',
          },
        },
        text: {
          color: '#6B7280',
          '&:hover': {
            backgroundColor: 'rgba(107, 114, 128, 0.08)',
            color: '#1F2937',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        colorPrimary: {
          backgroundColor: '#013369',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#D50A0A',
          color: '#FFFFFF',
        },
        filled: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: '#D50A0A',
            color: '#FFFFFF',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 12px rgba(213, 10, 10, 0.3)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#D50A0A',
          color: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#013369',
          backgroundImage: 'linear-gradient(135deg, #013369 0%, #012754 100%)',
          boxShadow: '0px 4px 8px rgba(1, 51, 105, 0.15)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: '#6B7280',
          '&.Mui-selected': {
            color: '#013369',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#013369',
          height: 3,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#D1D5DB',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#013369',
              boxShadow: '0 0 0 3px rgba(1, 51, 105, 0.1)',
            },
            '&.Mui-error fieldset': {
              borderColor: '#DC2626',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6B7280',
          },
          '& .MuiInputBase-input': {
            color: '#1F2937',
            '&::placeholder': {
              color: '#9CA3AF',
              opacity: 1,
            },
          },
        },
      },
    },
  },
});