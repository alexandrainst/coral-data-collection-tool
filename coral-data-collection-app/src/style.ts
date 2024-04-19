import { createStyles, colors } from './theme'

export const styles = createStyles({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  collectionStack: {
    width: '100%',
    height: '95%',
  },
  collectionTypographyStack: {
    width: '50%',
    minHeight: 'fit-content',
  },
  termsCheckBox: {
    '&.Mui-checked': {
      color: colors.green,
    },
  },
  popperBox: {
    backgroundColor: colors.green,
    borderRadius: '100px',
    width: '10%',
    height: '10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRecordBox: {
    border: 2,
    borderColor: colors.lightGrey,
    boxShadow: `5px 5px 5px ${colors.lightGrey}`,
    borderRadius: '8px',
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
  },
  contentStack: {
    width: '100%',
    height: '100%',
  },
  buttonStack: {
    width: '100%',
    height: '100%',
  },
  textDisplay: {
    padding: '10px',
  },
  helpButton: {
    marginRight: '15px',
    position: 'fixed',
    bottom: 20,
    right: 10,
  },
})
