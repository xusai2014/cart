import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false
    sm: false
    md: false
    lg: false
    xl: false
    phone: true
    pad: true
    smallPc: true
    largePc: true
  }
}

export {}
