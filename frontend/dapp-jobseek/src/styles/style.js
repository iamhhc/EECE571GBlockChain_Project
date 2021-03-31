import { makeStyles, withStyles } from '@material-ui/core';

// Custome style added to material-ui

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(10, 0, 1, 0),
  },
  subtitle: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    padding: theme.spacing(1.5, 2, 1.5, 2),
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing(1),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    padding: theme.spacing(2),
    // margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  linearProgress: {
    margin: theme.spacing(2),
  },
  formGridContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  formGridItemColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    backgroundColor: 'white',
    paddingRight: '5px',
    paddingLeft: '2px',
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 5, 1, 5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mainPageContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  verifyNumber: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%'
  },
  experienceTitle1: {
    backgroundColor: theme.palette.primary.light,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%'
  },
  experienceTitle2: {
    backgroundColor: theme.palette.primary.light,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%'
  },
  experienceTitle3: {
    backgroundColor: theme.palette.secondary.light,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%'
  },
  selfDescription: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    width: '80%'
  },
  form: {
    width: '100%',
  },
  expTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(10, 0, 1, 0),
  },
  
}));

export default useStyles;