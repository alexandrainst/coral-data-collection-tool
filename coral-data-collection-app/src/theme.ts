import { SxProps, Theme, createTheme } from '@mui/material'
import { CSSProperties } from 'react'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    customTypography: CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    customTypography?: CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    customTypography: true
  }
}

type Styles = {
  [name: string]: SxProps<Theme>
}

export const createStyles = <T extends Styles>(styles: T): T => styles

export const colors = {
  darkOrange: '#e05a00 ',
  darkGreen: '#146552',
  green: 'green',
  darkRed: '#cc0000',
  darkBlue: '#2c456b',
  darkGrey: '#2d2d2d',
  lightGrey: 'rgb(210, 210, 210)',
  black: '#000000',
  white: '#ffffff',
}

export let theme = createTheme()
const fontFamily = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'sans-serif',
].join(',')

theme = createTheme(theme, {
  typography: {
    fontFamily,
    customTypography: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '20px',
    },
  },
  palette: {
    primary: {
      main: colors.darkOrange,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.green,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily,
        },
        h1: {
          fontSize: 42,
          fontWeight: 400,
          color: colors.black,
        },
        h2: {
          fontSize: 36,
          fontWeight: 350,
          color: colors.black,
        },
        h3: {
          fontSize: 28,
          fontWeight: 300,
          color: colors.black,
        },
        h4: {
          fontSize: 18,
          fontWeight: 700,
          color: colors.black,
        },
        h5: {
          fontSize: 16,
          fontWeight: 600,
          color: colors.black,
        },
        h6: {
          fontSize: 14,
          fontWeight: 400,
          color: colors.black,
        },
      },
    },
  },
})
