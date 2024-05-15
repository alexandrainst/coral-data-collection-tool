import { createStyles, colors } from './theme'

export const styles = createStyles({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  collectionStack: {
    width: '60%',
    height: 'fit-content',
    paddingTop: '15px',
  },
  mainStack: {
    height: '100%',
    width: '100%',
  },
  collectionTypographyStack: {
    width: '100%',
    minHeight: 'fit-content',
  },
  termsCheckBox: {
    '&.Mui-checked': {
      color: colors.green,
    },
  },
  recordingPopup: {
    color: colors.white,
    width: '100%',
    height: '50%',
    backgroundColor: colors.green,
  },
  textRecordBox: {
    border: 2,
    borderColor: colors.lightGrey,
    boxShadow: `5px 5px 5px ${colors.lightGrey}`,
    borderRadius: '8px',
    height: 'fit-content',
    width: '100%',
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
