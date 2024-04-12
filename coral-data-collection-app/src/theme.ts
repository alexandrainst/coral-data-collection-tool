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
  darkOrange: '#ff8c00',
  darkGreen: '#146552',
  darkRed: '#cc0000',
  darkBlue: '#2c456b',
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
      main: colors.darkBlue,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily,
        },
        h1: {
          fontSize: 32,
          fontWeight: 700,
          color: colors.black,
        },
        h2: {
          fontSize: 28,
          fontWeight: 700,
          color: colors.black,
        },
        h3: {
          fontSize: 24,
          fontWeight: 700,
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
          fontSize: 15,
          fontWeight: 500,
          color: colors.black,
        },
      },
    },
  },
})
