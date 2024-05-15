import { SxProps, Theme, createTheme } from '@mui/material'

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
theme = createTheme(theme, {
  typography: {
    allVariants: {
      color: 'black',
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
  },
})
