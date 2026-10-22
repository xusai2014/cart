import './breakpoints'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  breakpoints: {
    values: {
      phone: 0,
      pad: 600,
      smallPc: 900,
      largePc: 1200,
    },
  },
  palette: {
    background: { default: '#F3EFE8', paper: '#FFFCF8' },
    primary: { main: '#1C2B27', contrastText: '#F7F4EF' },
    secondary: { main: '#8C4A32', contrastText: '#FFFCF8' },
    text: { primary: '#1C2B27', secondary: '#5E675F' },
    divider: 'rgba(28, 43, 39, 0.12)',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'var(--font-sans), "Segoe UI", sans-serif',
    h1: { fontWeight: 560, letterSpacing: '-0.04em', lineHeight: 1.05 },
    h2: { fontWeight: 560, letterSpacing: '-0.03em' },
    h3: { fontWeight: 560, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 650, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 44 },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F3EFE8' },
      },
    },
  },
})
